// Update di dalam ChatBot.jsx
import React, { useState, useRef, useEffect } from 'react'
import { CCard, CCardBody, CFormInput, CButton, CRow, CCol, CFormSwitch } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSend } from '@coreui/icons'
import axiosInstance from '../core/axiosInstance'
import ReactMarkdown from 'react-markdown'
import '../scss/style.scss' // Pastikan Anda memiliki file CSS ini untuk styling

const ChatBot = () => {
  const [messages, setMessages] = useState([{ sender: 'ai', text: 'Apa yang bisa saya bantu?' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isTodoMode, setIsTodoMode] = useState(false)
  const chatEndRef = useRef(null)
  const [pendingTodoResponse, setPendingTodoResponse] = useState(null)
  const [cancelSaveMessage, setCancelSaveMessage] = useState('')
  const [savingToFirebase, setSavingToFirebase] = useState(false)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim()) return

    const userMessage = { sender: 'user', text: input }
    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setLoading(true)

    try {
      const res = await axiosInstance.post('/api/ai-query', {
        question: input,
        mode: isTodoMode ? 'todo' : 'tanya',
      })

      const responseText = res.data.answer

      let formattedText = responseText

      if (isTodoMode && typeof responseText === 'object' && responseText !== null) {
        formattedText = Object.entries(responseText)
          .map(([day, task]) => `📅 **${day}**: ${task}`)
          .join('\n\n')
      }

      const aiMessage = {
        sender: 'ai',
        text: formattedText,
      }

      setMessages((prev) => [...prev, aiMessage])

      if (isTodoMode) {
        setPendingTodoResponse({
          question: input,
          data: responseText,
        })
      }
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'ai', text: 'Terjadi kesalahan saat menjawab.' }])
    } finally {
      setLoading(false)
    }
  }

  const confirmSaveTodo = async () => {
    if (!pendingTodoResponse) return

    setSavingToFirebase(true)
    try {
      await axiosInstance.post('/api/ai-query', {
        question: pendingTodoResponse.question,
        mode: 'todo',
        save: true,
      })

      setMessages((prev) => [...prev, { sender: 'ai', text: '✅ Jadwal berhasil disimpan.' }])
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'ai', text: '❌ Gagal menyimpan Jadwal.' }])
    } finally {
      setSavingToFirebase(false)
      setPendingTodoResponse(null)
    }
  }

  return (
    <CCard className="p-3 shadow-sm">
      <CCardBody style={{ height: '70vh', overflowY: 'auto' }}>
        <div className="d-flex flex-column gap-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`d-flex flex-column ${
                msg.sender === 'user' ? 'align-items-end' : 'align-items-start'
              } mb-3`}
            >
              {/* Nama pengirim di atas bubble */}
              <small className="fw-bold text-uppercase text-muted mb-1">
                {msg.sender === 'user' ? 'ME' : 'AI'}
              </small>

              {/* Bubble pesan */}
              <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'ai-bubble'}`}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
            </div>
          ))}

          {/* Bubble loading AI */}
          {loading && (
            <div className="d-flex flex-column align-items-start mb-3">
              <small className="fw-bold text-uppercase text-muted mb-1">AI</small>
              <div
                className="p-2 px-3 rounded-3 "
                style={{
                  backgroundColor: '#f5f3ef',
                  maxWidth: '75%',
                  whiteSpace: 'pre-wrap',
                }}
              >
                Sedang memproses...
              </div>
            </div>
          )}
        </div>
        {pendingTodoResponse && (
          <div className="text-center mt-3 d-flex justify-content-center gap-2">
            <CButton color="primary" variant="outline" onClick={confirmSaveTodo}>
              Simpan Jadwal
            </CButton>
            <CButton
              color="danger"
              variant="outline"
              onClick={() => {
                setMessages((prev) => [
                  ...prev,
                  { sender: 'ai', text: '⚠️ Jadwal tidak disimpan.' },
                ])
                setPendingTodoResponse(null)
              }}
            >
              Jangan Simpan
            </CButton>
          </div>
        )}
        {savingToFirebase && (
          <div className="d-flex flex-column align-items-start mb-3">
            <small className="fw-bold text-uppercase text-muted mb-1">AI</small>
            <div
              className="p-2 px-3 rounded-3 "
              style={{
                backgroundColor: '#f5f3ef',
                maxWidth: '75%',
                whiteSpace: 'pre-wrap',
              }}
            >
              Menyimpan...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </CCardBody>

      {/* Mode Switch + Input */}
      <CRow className="mt-3 g-2 align-items-center">
        {/* <CCol xs={12} className="mb-2 ">
          <CFormSwitch
            label="Mode Todo (jadwal mingguan)"
            checked={isTodoMode}
            onChange={() => setIsTodoMode(!isTodoMode)}
          />
        </CCol> */}

        <CCol xs={11}>
          <CFormInput
            placeholder="Tulis pertanyaan..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          />
        </CCol>
        <CCol xs={1} className="text-end">
          <CButton color="success" variant="outline" onClick={sendMessage} disabled={loading}>
            <CIcon icon={cilSend} />
          </CButton>
        </CCol>
      </CRow>
    </CCard>
  )
}

export default ChatBot
