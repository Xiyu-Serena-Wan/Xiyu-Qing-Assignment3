import React,{useState, useEffect} from 'react';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import axios from 'axios';

async function MsgPopUp() {
    // const 
    return (
        <Popup
        trigger={<button className="button"> Notifications </button>}
        modal
        nested
      >
        {close => (
          <div className="modal">
            <button className="close" onClick={close}>
              &times;
            </button>
            <div className="content">
              {' '}
              <br></br>
              You received the passwords shared by <strong>user1</strong>.
              <br></br>
              Do you want to accept?

            </div>
            <br></br>

            <div className="actions">
              <Popup
                trigger={<button className="button"> Show me </button>}
                position="bottom center"
                nested
              >
                {/* <span>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Beatae
                  magni omnis delectus nemo, maxime molestiae dolorem numquam
                  mollitia, voluptate ea, accusamus excepturi deleniti ratione
                  sapiente! Laudantium, aperiam doloribus. Odit, aut.
                </span> */}
              </Popup>
              <span>{' '}</span>
              <button
                className="button"
                onClick={() => {
                  close();
                }}
              >
                Deny
              </button>
            </div>
          </div>
        )}
      </Popup>

    );
}
