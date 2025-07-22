import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import './App.css'
import doubleTick from './assets/images/doubleTick.png'
import profile from './assets/images/IMG_7885.JPG'
import 'bootstrap/dist/css/bootstrap.min.css';
import send from './assets/images/send.png'



const socket = io('http://localhost:4000');

function App() {
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([{ msg: '', sender: '' }]);
  const [clientCount, setClientCount] = useState(0)

  useEffect(() => {

    const handleReceiveMessage = (data: string) => {
      displayMessage(data, 'server');
    };

    socket.on('receive_message', handleReceiveMessage);

    return () => {
      socket.off('receive_message', handleReceiveMessage);
    };
  }, []);




  const displayMessage = (msg: string, sender: string) => {
    const CurrentMsg = { msg, sender };
    setChat(prev => [...prev, CurrentMsg]);
  };


  const sendMessage = () => {
    if (message.trim()) {
      socket.emit('send_message', message);
      displayMessage(message, 'client')
      setMessage('');
      console.log(chat);
    }
  };

  return (
    <div>

      {/* <img src={bgImage} alt="" className='vh-100 d-none d-md-block' style={{borderLeft:'.5px white solid',borderRight:'.5px white solid'}}/> */}
      <div id='navBar' style={{ width: '100%' }}>

        <div className="d-flex gap-3 p-3 sticky-top" style={{ backgroundColor: '#1d1d1d' }}>
          <div>
            <img src={profile} style={{ height: '50px', width: '50px', borderRadius: '100%', cursor: 'pointer' }} alt="" />
          </div>
          <div className='mt-1'>
            <p className='text-white m-0' style={{ fontWeight: 600 }}>Mr.Maddy (you)</p>
            <p className='m-0' style={{ color: 'grey', fontSize: '12.5px' }}>Message Yourself</p>
          </div>
        </div>

        <div id='chatSpace'>

          {chat.length > 1 && chat.map((data, i) => (
            (data.msg && <div style={{ margin: '15px', display: 'flex', flexWrap: 'wrap', justifyContent: (data.sender == 'client' ? 'flex-end' : 'flex-start') }}>
              <div key={i} style={{ color: 'white', backgroundColor: (data.sender == 'client' ? 'rgb(0, 116, 71)' : 'rgb(100, 100, 100)'), padding: '5px 10px', borderRadius: '10px', maxWidth: '80%', wordWrap: 'break-word', fontSize: '15px', gap: '5px' }}>
                <div style={{ wordWrap: 'break-word', paddingRight: '70px' }}>{data.msg}</div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <div id='Time'>10:30 AM</div>
                  <img src={doubleTick} id='doubleTick' alt="" />
                </div>
              </div>
            </div>)
          ))}



          <div id='inputBoxWrap' className='px-3'>
            <div id='inputBox' className='d-flex gap-2'>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type message"
                className='py-2 rounded-5 inputBox'
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    sendMessage();
                  }
                }}
              />
              {/* <button className='btn btn-primary' onClick={sendMessage}>Send</button> */}
              {message&&<img src={send} onClick={sendMessage} alt="" id='sendButton' />}
            </div>
          </div>



        </div>

      </div>
    </div>
  );
}

export default App;
