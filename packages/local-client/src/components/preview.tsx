import "../style/preview.css";
import { useEffect, useRef } from "react";

interface PreviewProps {
  code: string;
  err: string;
}

const html = `
    <html>
        <head>
            <style>html {background-color: white;}</style>
        </head>
        <body>
            <div id="root" style="font-family: sans-serif;">Live Preview</div>
            <script>
                const handleError = (err) =>{
                    const root = document.querySelector('#root');
                        root.innerHTML = '<div style="color: red; font-family: sans-serif; font-size:20px;"><h4>Runtime Error</h4>' + err + '</div>'
                        console.error(err)
                };

                window.addEventListener('error', (event)=>{
                    event.preventDefault();
                    handleError(event.error)
                })

                window.addEventListener('message', (event)=>{
                    try {
                        eval(event.data);
                    }catch(err) {
                        handleError(err)
                    }
                }, false);
            </script>
        </body>
    </html>
  `;

export const Preview: React.FC<PreviewProps> = (props) => {
  const { code, err } = props;
  const iframe = useRef<any>();

  useEffect(() => {
    //before running the bundling and transpiling - reset innerhtml in iframe
    iframe.current.srcdoc = html;
    //give it time to load to deliver message
    setTimeout(() => {
      iframe.current.contentWindow.postMessage(code, "*");
    }, 50);
  }, [code]);

  return (
    <div className="preview-wrapper">
      <iframe
        ref={iframe}
        title="test"
        /* src="/test.html" */
        srcDoc={html}
        sandbox="allow-scripts"
      />
      {err && (
        <div className="preview-error">
          <p style={{ color: "white" }}>...</p>
          <h4>Build Error</h4>
          {err}
        </div>
      )}
    </div>
  );
};

//<iframe title="test" /* src="/test.html" */ srcDoc={html} sandbox="" />
//makes it so localStorage is not accessible
