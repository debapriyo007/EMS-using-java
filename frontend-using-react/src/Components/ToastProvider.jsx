import React,{createContext,useContext,useState,useRef,useEffect}from"react";
const ToastContext=createContext(null);
export const useToast=()=>useContext(ToastContext);

export default function ToastProvider({children}){
  const[toasts,setToasts]=useState([]);
  const idRef=useRef(0);

  const showToast=(message,type="info",duration=3000)=>{
    const id=++idRef.current;
    setToasts(prev=>[...prev,{id,message,type,closing:false}]);
    setTimeout(()=>setToasts(prev=>prev.map(t=>t.id===id?{...t,closing:true}:t)),duration-300);
    setTimeout(()=>setToasts(prev=>prev.filter(t=>t.id!==id)),duration);
  };

  useEffect(()=>{
    const style=document.createElement("style");
    style.innerHTML=`
      .toast-wrapper{
        position:fixed;
        top:20px;
        left:50%;
        transform:translateX(-50%);
        display:flex;
        flex-direction:column;
        gap:10px;
        z-index:10000;
        align-items:center;
      }
      .toast{
        min-width:280px;
        background:#fff;
        padding:3px 3px;
        border-radius:3px;
        border:1px solid #000;
        box-shadow:0 2px 10px rgba(0,0,0,0.1);
        display:flex;
        justify-content:space-between;
        align-items:center;
        gap:10px;
        opacity:1;
        transform:translateY(0);
        transition:all .3s ease;
        position:relative;
      }
      .toast.success{border-left:5px solid #22c55e;} /* Green 500 */
      .toast.error{border-left:5px solid #ef4444;}   /* Red 500 */
      .toast.info{border-left:5px solid #3b82f6;}    /* Blue 500 */

      .toast.closing{
        opacity:0;
        transform:translateY(-20px);
      }
      .toast .msg{
        font-size:14px;
        color:#333;
        position:relative;
        z-index:1;
      }
      .toast .close{
        border:none;
        background:transparent;
        cursor:pointer;
        font-size:16px;
        line-height:1;
        color:#555;
        position:relative;
        z-index:1;
      }
      .toast .close:hover{color:#000;}
    `;
    document.head.appendChild(style);
    return()=>{document.head.removeChild(style)};
  },[]);

  return(
    <ToastContext.Provider value={{showToast}}>
      {children}
      <div className="toast-wrapper">
        {toasts.map(t=>(
          <div key={t.id} className={`toast ${t.type}${t.closing?" closing":""}`}>
            <div className="msg">{t.message}</div>
            <button className="close" onClick={()=>setToasts(prev=>prev.filter(x=>x.id!==t.id))}>×</button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
