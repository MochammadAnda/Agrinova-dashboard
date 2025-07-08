// Update di dalam ChatBot.jsx
import React, { useState, useRef, useEffect } from 'react'
import { CCard, CCardBody, CFormInput, CButton, CRow, CCol, CFormSwitch } from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilSend } from '@coreui/icons'
import axiosInstance from '../core/axiosInstance'

const ChatBot = () => {
  const [messages, setMessages] = useState([{ sender: 'ai', text: 'Apa yang bisa saya bantu?' }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isTodoMode, setIsTodoMode] = useState(false)
  const chatEndRef = useRef(null)

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

      const responseText = isTodoMode ? JSON.stringify(res.data.answer, null, 2) : res.data.answer

      const aiMessage = { sender: 'ai', text: responseText }
      setMessages((prev) => [...prev, aiMessage])
    } catch (err) {
      setMessages((prev) => [...prev, { sender: 'ai', text: 'Terjadi kesalahan saat menjawab.' }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <CCard className="p-3 shadow-sm">
      <CCardBody style={{ height: '70vh', overflowY: 'auto' }}>
        <div className="d-flex flex-column gap-3">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`d-flex ${msg.sender === 'user' ? 'justify-content-end' : 'justify-content-start'}`}
            >
              <div
                className={`p-2 px-3 rounded-3 text-white`}
                style={{
                  backgroundColor: msg.sender === 'user' ? '#2e7d32' : '#81c784',
                  maxWidth: '75%',
                  whiteSpace: 'pre-wrap',
                }}
              >
                <small className="d-block fw-bold text-uppercase mb-1">
                  {msg.sender === 'user' ? 'ME' : 'AI'}
                </small>
                {msg.text}
              </div>
            </div>
          ))}
          <div ref={chatEndRef} />
        </div>
      </CCardBody>

      {/* Mode Switch + Input */}
      <CRow className="mt-3 g-2 align-items-center">
        <CCol xs={12} className="mb-2 text-end">
          <CFormSwitch
            label="Mode Todo (jadwal mingguan)"
            checked={isTodoMode}
            onChange={() => setIsTodoMode(!isTodoMode)}
          />
        </CCol>

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
