import React from "react";

/* Header part for all the modals */
export default function ModalHeader ({ title }) {
    return (
        <div id= "modal-header" align="left" style={{
            display: 'flex',
            width: 'auto',
            alignItems: 'center',
            padding: '11px',
            background: 'purple',
            color: 'white',
            height: 70,
            fontSize: '25px',
            margin: '-10px -10px 0px -10px',
        }}>
            {title}
        </div>
    );
}