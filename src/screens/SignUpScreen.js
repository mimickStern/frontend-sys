import React, { useContext, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Helmet } from 'react-helmet-async';
import { Store } from '../Store';
import { toast } from 'react-toastify';
import { getError } from '../utilis';

const SignupScreen = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    



    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { userInfo } = state;

    const submitHandler = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Password does not match');
            return;
        }

        try {
            const { data } = await axios.post('/api/signup/', {
                
                username,
                email,
                password,
            });
            
            ctxDispatch({ type: 'USER_SIGNIN', payload: data });
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate('/');
        } catch (err) {
            toast.error(getError(err));
        }
    };

    return (
        <Container className="small-container">
           
           <Helmet>
                <title>Sign Up</title>
            </Helmet>

            <h1 className="my-3">Sign Up</h1>

            <Form onSubmit={submitHandler} className="d-flex flex-column align-items-center">
                <Form.Group className="mb-3 w-50" controlId="username">
                    <Form.Label>Username</Form.Label>
                    <Form.Control onChange={(e) => setUsername(e.target.value)} required />
                </Form.Group>

                <Form.Group className="mb-3 w-50" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" required onChange={(e) => setEmail(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3 w-50" controlId="password">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" required onChange={(e) => setPassword(e.target.value)} />

                    <Form.Group className="mb-3 " controlId="confirmPassword">
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control type="password" onChange={(e) => setConfirmPassword(e.target.value)} required />
                    </Form.Group>
                </Form.Group>

                <div className="mb-3">
                    <Button type="submit">Sign Up</Button>
                </div>
                <div className="mb-3">
                    Already a user?{' '}
                    <Link to={"/signin"}>Sign-In</Link>
                </div>
            </Form>

        </Container>
    )
}


export default SignupScreen