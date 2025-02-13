import { useState } from "react";

export const shortenAddy = (addy: string) => {
    const first = addy.slice(0, 5);
    let lastFive = addy.slice(-3);
    return `${first}...${lastFive}`;
}

    export function ImageWithFallback(props: any) {
        const src: string = props.src;
        const classname: string = props.classname;
        const styles: any = props.styles;
        const [imageSrc, setImageSrc] = useState(src);
        const fallbackSrc = "http://find4.io/f4-42.png";
        console.log("LDLDLDLDLDLDL");
        console.log(src);
      
        const handleImageError = () => {
          if (imageSrc !== fallbackSrc) {
            setImageSrc(fallbackSrc); // Only update if we haven't already tried the fallback
          }
        };
      
        return (
          <img  
          className={classname}
        // src={src != "" ? src : "http://find4.io/f4-42.png"} 
        // onError={() => {src='http://example.com/existent-image.jpg'}}
      //   alt={`${item.username}'s profile picture`}  
      src={imageSrc} 
      onError={handleImageError}
        style={styles}  
      />
        );
      };