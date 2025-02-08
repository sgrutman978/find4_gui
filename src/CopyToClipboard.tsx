import React, { useRef } from 'react';
import { shortenAddy } from './Utility';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';

function CopyToClipboard(props: any) {
    // Use useRef to get a reference to the DOM node where the text is displayed
    const textRef = useRef<HTMLDivElement>(null);
    // console.log(props.item.addy);
    const addy = props.item && props.item.addy ? props.item.addy : (props.addy ? props.addy : "");
    // console.log(addy);

    const handleCopyClick = async () => {
        // if (textRef.current) {
            try {
                // Copy the text inside the element to the clipboard
                await navigator.clipboard.writeText(addy);
                console.log('Text copied to clipboard');
                // Optionally, you could show a message to the user here
                // alert('Text copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy text: ', err);
            }
        // }
    };

    return (
        <td><div className="copyable" onClick={handleCopyClick} style={{ cursor: 'pointer' }}>{shortenAddy(addy)} <FontAwesomeIcon icon={faCopy} /></div></td>
    );
};

export default CopyToClipboard;