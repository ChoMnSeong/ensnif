import React, { useState, ChangeEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

interface MailExistsResponse {
    exists: boolean
}

const MailPage: React.FC = () => {
    const [mail, setMail] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const navigate = useNavigate()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setMail(e.target.value)
    }

    const checkEmail = async () => {
        if (!mail) {
            setError('이메일을 입력해주세요.')
            return
        }

        setLoading(true)
        setError('')

        try {
            const res = await axios.get<MailExistsResponse>(
                `http://localhost:8080/mail/exists?mail=${mail}`,
            )
            const exists = res.data.exists

            if (exists) {
                navigate('/auth/signin', { state: { mail } })
            } else {
                navigate('/auth/signup', { state: { mail } })
            }
        } catch (err: unknown) {
            setError('서버 오류 발생')
            console.error(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: 'auto', padding: '2rem' }}>
            <h2>이메일을 입력해주세요</h2>
            <input
                type="email"
                placeholder="이메일"
                value={mail}
                onChange={handleChange}
                style={{
                    width: '100%',
                    padding: '0.5rem',
                    marginBottom: '1rem',
                }}
            />
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <button onClick={checkEmail} disabled={loading}>
                {loading ? '확인 중...' : '확인'}
            </button>
        </div>
    )
}

export default MailPage
