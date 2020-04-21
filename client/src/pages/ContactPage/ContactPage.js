import React, {useState, useCallback, useEffect, useContext} from 'react'
import { useHttp } from '../../hooks/http.hook'
import { AuthContext } from '../../context/AuthContext'
import { ServerResponseWindow } from '../../components/ModalWindows/ModalWindows'
import './ContactPage.css'

export const ContactPage = () => {
    document.title = 'Contact'
    const {request} = useHttp()
    const {token, tokenTime, expireTime} = useContext(AuthContext)
    const [form, setForm] = useState({ name: '',  email: '', subject: '', message: '' })
    const [btnDisabled, setBtnDisabled] = useState(true)
    const [validations, setValidations] = useState({
        isNameEmpty: true,
        isEmailEmpty: true,
        isSubjectEmpty: true,
        isMessageEmpty: true,
        isNotEmail: true
    })
    const [modal, setModal] = useState({
        show: false,
        category: '',
        symbol: '',
        text: ''
    })
    
    const isAuthenticated = tokenTime + expireTime > Date.now()

    const getUser = useCallback( async () => {
        if (token && isAuthenticated) {
            try {
                const fetched = await request(`/api/user/me`, 'GET', null, {
                    Authorization: `Bearer ${token}`
                })
                setForm({name: fetched.name, email: fetched.email, subject: '', message: ''})
            } catch (e) {}
        } else { }
    }, [token, isAuthenticated, request])    
    
    useEffect( () => { getUser() }, [getUser, token])


    const changeHandler = event => {
        const nodeName = event.target.name
        const nodeValue = event.target.value
        //const nodeId = event.target.id
        
        setForm({ ...form, [nodeName]: nodeValue})

        if (nodeName === 'name') {
            if (nodeValue.trim() !== '') {
                return setValidations({ ...validations, isNameEmpty: false })
            }

        } else if (nodeName === 'email') {
            let isEmailEmpty = true
            let isNotEmail = true

            if (nodeValue.trim() !== '') {
                isEmailEmpty = false
            }
            if (/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(nodeValue)) {
                isNotEmail = false
            }
            return setValidations({ ...validations, isEmailEmpty, isNotEmail })

        } else if (nodeName === 'subject') {
            if (nodeValue.trim() !== '') {
                return setValidations({ ...validations, isSubjectEmpty: false})
            }

        } else if (nodeName === 'message') {
            if (nodeValue.trim() !== '') {
                return setValidations({ ...validations, isMessageEmpty: false})
            }
        }
    }

    useEffect( () => {
        if (!Object.values(validations).includes(true) && !Object.values(form).includes('') && btnDisabled === true) {
            setBtnDisabled(false)
        } else if ((Object.values(validations).includes(true) || Object.values(form).includes('')) && btnDisabled === false) {
            setBtnDisabled(true)
        }
    }, [validations, form, btnDisabled])

    const sendMessageHandler = async () => {
        setBtnDisabled(true)
        if (Object.values(validations).includes(true) || Object.values(form).includes('')) {
            return console.log('You could not get here, button was disabled -_-')
        }

        try {
            const data = await request('/api/user/mail', 'POST', {...form})
            setModal({
                show: true,
                category: 'success',
                symbol: '✓',
                text: data.message
            })
            setForm({ name: '', email: '', subject: '', message: '' })
            setValidations({ 
                isNameEmpty: true, 
                isEmailEmpty: true, 
                isSubjectEmpty: true, 
                isMessageEmpty: true,
                isNotEmail: true
            })
        } catch (e) {
            setModal({
                show: true,
                category: 'danger',
                symbol: '×',
                text: 'Something went wrong. Please accept our sincere apologies for this inconvenience. Try to contact in another way.'
            })
        }
    }

    const closeModalHandler = () => setModal({ ...modal, show: false })

    return (
        <div className="contact-page">
            <div className="contact-info">
                <div className="contact-info-section">
                    <p>Address</p>
                    <p>835 Market St, San Francisco, CA 94103, United States</p>
                </div>
                <div className="contact-info-section">
                    <p>Information</p>
                    <p>+1 788-111-1899</p>
                    <p>info@movieplanet.com</p>
                </div>
                <div className="contact-info-section">
                    <p>Promotions</p>
                    <p>+1 788-222-1899</p>
                    <p>promo@movieplanet.com</p>
                </div>
                <div className="contact-info-section">
                    <p>Technical support</p>
                    <p>+1 788-333-1899</p>
                    <p>support@movieplanet.com</p>
                </div>
                <div className="contact-info-section">
                    <p>Partnership</p>
                    <p>+1 788-444-1899</p>
                    <p>partner@movieplanet.com</p>
                </div>
            </div>
            <div className="contact-form">
                <p>Have an offer or a question? Contact us!</p>
                <div>
                    <input 
                        id="user-name"
                        name="name"
                        type="text"
                        value={form.name}
                        onChange={changeHandler}
                        maxLength="40"
                        placeholder="Your name" 
                        autoComplete="off"
                    />
                    <input
                        id="email"
                        name="email" 
                        type="text"
                        value={form.email}
                        onChange={changeHandler}
                        maxLength="40"
                        placeholder="Email" 
                        autoComplete="off"
                    />
                    <input 
                        id="subject"
                        name="subject"
                        type="text"
                        value={form.subject}
                        onChange={changeHandler}
                        maxLength="80"
                        placeholder="Subject" 
                        autoComplete="off"
                    />
                </div>
                <div>
                    <textarea 
                        id="message"
                        name="message" 
                        cols="8" 
                        wrap="hard" 
                        value={form.message}
                        onChange={changeHandler}
                        placeholder="Write here your message"
                    />
                </div>
                <div className="submit">
                    <button
                        onClick={sendMessageHandler}
                        disabled={btnDisabled}
                    >
                        send it
                    </button>
                </div>
            </div>
            <iframe 
                className="map"
                title="map" 
                src="https://www.google.com/maps/embed?pb=!1m12!1m8!1m3!1d6306.488020286462!2d-122.40819136134647!3d37.78432092710006!3m2!1i1024!2i768!4f13.1!2m1!1smovie%20theater!5e0!3m2!1sen!2spl!4v1586304296970!5m2!1sen!2spl" 
                width="600" 
                height="450" 
                frameBorder="0"  
                allowFullScreen=""
                tabIndex="0"
            />
            {
                modal.show 
                ? <ServerResponseWindow 
                    props={{
                        category: modal.category,
                        symbol: modal.symbol,
                        text: modal.text,
                        closeModalHandler: closeModalHandler
                    }}
                /> : null
            }
        </div>
    )
}