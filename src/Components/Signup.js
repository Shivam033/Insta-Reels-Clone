import * as React from 'react';
import { useState, useContext } from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';
import Alert from '@mui/material/Alert';
import TextField from '@mui/material/TextField';
import './Signup.css';
import insta from '../Assets/Instagram.JPG'
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import {Link, useHistory} from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';
import { database,storage } from '../firebase';

export default function Signup() {
    const useStyles = makeStyles({
        text1:{
            color:'grey',
            textAlign:'center'
        },
        card2:{
            height: '4vh',
            marginTop: '2%',
            paddingTop:'2%',
            display:'flex',
            alignItems:'center',
            justifyContent: 'center'
        }
    })
    const classes = useStyles();

    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [name,setName] = useState('');
    const [file,setFile] = useState(null);
    const [error,setError] = useState('');
    const [loading,setLoading] = useState(false);
    const history = useHistory()
    const {signup} = useContext(AuthContext);
    
    const handleClick = async() => {
        if(file==null){
            setError("Please upload a profile photo");
            setTimeout(()=>{
                setError('')
            },3000)
            return;
        }
        try{
            setError('')
            setLoading(true)
            let userObj = await signup(email, password)
            let uid = userObj.user.uid
            // console.log(uid);
            const uploadTask = storage.ref(`/users/${uid}/ProfileImage`).put(file);
            uploadTask.on('state_changed',fn1,fn2,fn3);
            // fn1 progress
            // fn2 error
            // fn3 success
            function fn1(snapshot){
                let progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100;
                console.log(`Upload is ${progress}% done.`);
            }
            function fn2(error){
                setError(error);
                setTimeout(()=>{
                    setError('')
                },3000)
                setLoading(false)
                return;
            }
            function fn3(){
                uploadTask.snapshot.ref.getDownloadURL().then((url)=>{
                    console.log(url);
                    database.users.doc(uid).set({
                        email:email,
                        userId:uid,
                        fullname:name,
                        profileUrl:url,
                        createdAt:database.getTimeStamp()
                    })
                })
                setLoading(false);
                history.push('/')
            }
        }catch(err){
            setError(err);
            setTimeout(()=>{
                setError('')
            },3000)
        }
    }
    return ( 
        <div className="signupWrapper">
            <div className="signupCard">
                <Card variant='outlined'>
                    <CardContent>
                        <div className='insta-logo'>
                            <img src={insta} alt=""/>
                        </div>
                        <Typography className={classes.text1} variant="subtitle1">
                            SignUp to see photos and video from your friends.
                        </Typography>
                        {error!="" && <Alert severity="error">{error}</Alert>}
                        <TextField id="outlined-basic" label="Email" variant="outlined" fullWidth={true} margin='dense' size='small' value={email} onChange={(e)=>setEmail(e.target.value)}/>
                        <TextField id="outlined-basic" label="Password" variant="outlined" fullWidth={true} margin='dense' size='small' value={password} onChange={(e)=>setPassword(e.target.value)}/>
                        <TextField id="outlined-basic" label="Full Name" variant="outlined" fullWidth={true} margin='dense' size='small' value={name} onChange={(e)=>setName(e.target.value)}/>
                        <Button size="small" color="secondary" startIcon={<CloudUploadIcon/>} variant="outlined" margin='dense' fullWidth={true} component='label'>
                            Upload Profile Photo
                            <input type="file" accept="image/*" hidden onChange={(e)=>setFile(e.target.files[0])}/>
                        </Button>
                    </CardContent>
                    <CardActions>
                        <Button color='primary' fullWidth={true} variant='contained' disabled={loading} onClick={handleClick}>
                            Sign Up
                        </Button>
                    </CardActions>
                    <CardContent>
                        <Typography className={classes.text1} variant="subtitle1">
                            By signing up, you agree to our Terms, Conditions and Cookies Policy
                        </Typography>
                    </CardContent>
                </Card>
                <Card variant="outlined" className={classes.card2}>
                    <CardContent>
                    <Typography className={classes.text1} variant="subtitle1">
                        Having an account ? <Link to="/login" style={{textDecoration:'none'}}>Login</Link>
                    </Typography>
                    </CardContent>
                </Card>
            </div>
        </div>

  );
}

