import React, { useState, useEffect, useContext } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useHttp } from '../../hooks/http.hook'
import { AuthContext } from '../../context/AuthContext'
import { Input } from '../../components/Input/Input'
import './AuthPage.css'

export const AuthPage = () => {
    const auth = useContext(AuthContext)
    const { loading, error, request, clearError } = useHttp()
    const authType = useParams().type
    if (authType === 'signin') {
        document.title = 'Authorization'
    } else { document.title = 'Registration' }

    // States for values from forms Authorization and Registration
    const [form, setForm] = useState({
        userName: '', email: '', password: '', repPassword: ''
    })
    const [signInForm, setSignInForm] = useState({
        emailIn: '', passwordIn: ''
    })
    
    // Handle response with errors from server
    const [signInError, setSignInError] = useState('')
    const [signUpError, setSignUpError] = useState('')

    useEffect(() => {
        if (error) {
            if (authType === 'signin') {
                setSignInError(error)
            } else {
                setSignUpError(error)
            }
            clearError()
        }
    }, [error, clearError, authType])

    // All validations should become false to unlock submit button
    const [validations, setValidation] = useState({
        isEmptyName: true,
        hasSpacePassword: true,
        hasNonalphanum: true,
        isNotEmail: true,
        hasLessSymbols: true,
        doesNotMatchPass: true
    })

    // Labels for Registration form
    const [labels, setLabel] = useState({
        nameLabel: 'Your name',
        emailLabel: 'Email',
        passLabel: 'Password',
        repPassLabel: 'Repeat your password'
    })

    // State for buttons, when true - button is disabled
    const [signUpBtn, setSignUpBtn] = useState(true)
    const [signInBtn, setSignInBtn] = useState(true)


    // Handle buttons' states by monitoring validation
    useEffect( () => {
        if (!Object.values(validations).includes(true) && !Object.values(form).includes('') && signUpBtn === true) {
            setSignUpBtn(false)
        } else if ((Object.values(validations).includes(true) || Object.values(form).includes('')) && signUpBtn === false) {
            setSignUpBtn(true)
        }
    }, [validations, form, signUpBtn])

    useEffect( () => {
        if (signInForm.emailIn.trim() !== '' && signInForm.passwordIn.trim() !== '' && signInBtn === true) {
            setSignInBtn(false)
        } else if ((signInForm.emailIn.trim() === '' || signInForm.passwordIn.trim() === '') && signInBtn === false) {
            setSignInBtn(true)
        }
    }, [signInForm, signInBtn])

    // Small functions which should make validation code shorter
    const changeValidationStatus = (validationName, isSuch) => {
        setValidation({ ...validations, [validationName]: !!isSuch})
    }

    const changeLabelValue = (labelName, value) => {
        setLabel({ ...labels, [labelName]: value})
    }

    const displayValidation = (elementId, parentNodeClass) => {
        document.getElementById(elementId).parentNode.setAttribute('class', parentNodeClass)
    }

    const validationManager = (valName, isValSuch, labelName, labelValue, elementId, parentNodeClass) => {
        changeValidationStatus(valName, isValSuch)
        changeLabelValue(labelName, labelValue)
        displayValidation(elementId, parentNodeClass)
    }

    // I should find another way to validate on place, in next updates...
    const changeHandler = event => {
        const nodeName = event.target.name
        const nodeValue = event.target.value
        const nodeId = event.target.id

        if (authType === 'signin') {
            return setSignInForm({ ...signInForm, [nodeName]: nodeValue})
        }

        if (authType !== 'signin' ) {
            setForm({ ...form, [nodeName]: nodeValue })

            const classNameDefault = 'Input'
            const classNameWarning = 'Input warning'

            if (nodeName === 'userName') {      
                
                if (nodeValue.trim() === '') { 
                    validationManager(
                        'isEmptyName', true, 
                        'nameLabel', 'Please, write your name', 
                        nodeId, 'Input warning'
                    )
                } else if (validations.isEmptyName === true) {
                    validationManager(
                        'isEmptyName', false, 
                        'nameLabel', 'Your name', 
                        nodeId, 'Input'
                    )
                }
                
                if (/[^\w-']/.test(nodeValue) || /\d/.test(nodeValue)) {
                    validationManager(
                        'hasNonalphanum', true, 
                        'nameLabel', 'Name can contain only letters, dash and apostrophe', 
                        nodeId, 'Input warning'
                    )
                } else if (validations.hasNonalphanum === true) {
                    validationManager(
                        'hasNonalphanum', false, 
                        'nameLabel', 'Your name', 
                        nodeId, 'Input'
                    )
                }
            } else if (nodeName === 'email') {

                if (!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(nodeValue)) {
                    validationManager(
                        'isNotEmail', true, 
                        'emailLabel', 'Email is invalid', 
                        nodeId, 'Input warning'
                    )        
                } else if (validations.isNotEmail === true) {
                    validationManager(
                        'isNotEmail', false, 
                        'emailLabel', 'Email', 
                        nodeId, 'Input'
                    )
                }
            } else if (nodeName === 'password') {
                let hasSpacePassword, hasLessSymbols, doesNotMatchPass
                let passLabel, repPassLabel
                let parentNodeClass, repPassParentNodeClass

                if (/ /.test(nodeValue)) { 
                    return (
                        setValidation({ ...validations, hasSpacePassword: true }),
                        setLabel({ ...labels, passLabel: 'Password cannot contain space symbol'}),
                        displayValidation(nodeId, classNameWarning)
                    )
                } else {
                    hasSpacePassword = false
                    passLabel = 'Password'
                    parentNodeClass = classNameDefault
                }

                if (nodeValue.trim().length < 6) {
                    return (
                        setValidation({ ...validations, hasSpacePassword, hasLessSymbols: true }),
                        setLabel({ ...labels, passLabel: 'Password must contain 6 simbols' }),
                        displayValidation(nodeId, classNameWarning)
                    )
                } else {
                    hasLessSymbols = false
                    passLabel = 'Password'
                    parentNodeClass = classNameDefault
                }

                const repPassValue = document.getElementById('rep-password').value
                if (repPassValue !== nodeValue && repPassValue.trim() !== '') {
                    doesNotMatchPass = true
                    passLabel = 'Passwords do not match'
                    repPassLabel = 'Passwords do not match'
                    parentNodeClass = classNameWarning
                    repPassParentNodeClass = classNameWarning
                } else {
                    doesNotMatchPass = false
                    passLabel = 'Password'
                    repPassLabel = 'Repeat your password'
                    parentNodeClass = classNameDefault
                    repPassParentNodeClass = classNameDefault
                }
                setValidation({ ...validations, hasSpacePassword, hasLessSymbols, doesNotMatchPass })
                setLabel({ ...labels, passLabel, repPassLabel })
                displayValidation(nodeId, parentNodeClass)
                displayValidation('rep-password', repPassParentNodeClass)

            } else if (nodeName === 'repPassword') {

                const passValue = document.getElementById('password').value
                if (passValue !== nodeValue) {
                    validationManager(
                        'doesNotMatchPass', true, 
                        'repPassLabel', 'Passwords do not match', 
                        nodeId, 'Input warning'
                    )
                } else if (validations.doesNotMatchPass === true) {
                    if (validations.hasSpacePassword === true) {
                        changeValidationStatus('doesNotMatchPass', false)
                        setLabel({ 
                            ...labels, 
                            passLabel: 'Password cannot contain space symbol',
                            repPassLabel: 'Repeat your password'
                        })
                        displayValidation('password', 'Input warning')
                        displayValidation(nodeId, 'Input')
                    } else if (validations.hasLessSymbols === true) {
                        changeValidationStatus('doesNotMatchPass', false)
                        setLabel({ 
                            ...labels, 
                            passLabel: 'Password must contain 6 simbols',
                            repPassLabel: 'Repeat your password'
                        })
                        displayValidation('password', 'Input warning')
                        displayValidation(nodeId, 'Input')
                    } else {
                        changeValidationStatus('doesNotMatchPass', false)
                        setLabel({ 
                            ...labels, 
                            passLabel: 'Password',
                            repPassLabel: 'Repeat your password'
                        })
                        displayValidation(nodeId, 'Input')
                        displayValidation('password', 'Input')
                    }
                }
            }
        }
    }    

    const registrationHandler = async () => {
        if (!Object.values(validations).includes(true)) {
            const noUserName = form.userName.trim().length === 0 
            const noEmail = form.email.trim().length === 0
            const noPassword = form.password.trim().length === 0
            const noRepPassword = form.repPassword.trim().length === 0
        
            if ( noUserName || noEmail || noPassword || noRepPassword ) {
                return console.log('You shall not pass!')
            }
            console.log(form)
            try {
                const data = await request('/api/auth/registration', 'POST', {...form})
                auth.login(data.token, data.userId, data.tokenStart)
            } catch (e) {}
        }
    }

    const loginHandler = async () => {
        if (signInForm.emailIn.trim() !== '' && signInForm.passwordIn.trim() !== '') {
            console.log(signInForm)
            try {
                const data = await request('/api/auth/login', 'POST', {
                    email: signInForm.emailIn,
                    password: signInForm.passwordIn
                })
                auth.login(data.token, data.userId, data.tokenStart)
            } catch (e) {}
        }
    }

    return (
        <div className="auth-page">
            { authType === 'signin' 
              ? <div className="auth-block">
                    <p>Authorization</p>
                    <Input 
                        inputId="emailIn"
                        type="email"
                        name="emailIn"
                        value={signInForm.emailIn}
                        onChange={changeHandler}
                        maxLength="40"
                        placeholder="example@mail.com"
                        label="Email"
                    />
                    <Input 
                        inputId="passwordIn"
                        type="password"
                        name="passwordIn"
                        value={signInForm.passwordIn}
                        onChange={changeHandler}
                        maxLength="30"
                        placeholder="minimum 6 characters"
                        label="Password"
                    />
                    { signInError ? <p className="error-message">{signInError}</p> : null}
                    <div className="auth-buttons">
                        <p>Do not have an account? &nbsp;
                            <Link to={'/auth/signup'}>Sign up here!</Link>
                        </p>
                        <button
                            onClick={loginHandler}
                            disabled={loading || signInBtn}
                        >
                            Sign In
                        </button>
                    </div>
                </div>
              : <div className="auth-block">
                    <p>Registration</p>
                    <Input 
                        inputId="user-name"
                        type="text"
                        name="userName"
                        value={form.userName}
                        onChange={changeHandler}
                        maxLength="25"
                        placeholder="Christopher"
                        label={labels.nameLabel}
                    />
                    <Input 
                        inputId="email"
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={changeHandler}
                        maxLength="40"
                        placeholder="chris@mail.com"
                        label={labels.emailLabel}
                    />
                    <Input 
                        inputId="password"
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={changeHandler}
                        maxLength="30"
                        placeholder="minimum 6 characters"
                        label={labels.passLabel}
                    />
                    <Input 
                        inputId="rep-password"
                        type="password"
                        name="repPassword"
                        value={form.repPassword}
                        onChange={changeHandler}
                        maxLength="30"
                        placeholder="minimum 6 characters"
                        label={labels.repPassLabel}
                    />
                    { signUpError ? <p className="error-message">{signUpError}</p> : null}
                    <div className="auth-buttons">
                        <p>Already have an account? &nbsp;
                            <Link to={'/auth/signin'}>Sign in here!</Link>
                        </p>
                        <button
                            onClick={registrationHandler}
                            disabled={loading || signUpBtn}
                        >
                            Sign Up
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}