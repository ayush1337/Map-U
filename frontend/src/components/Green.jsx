import Green1 from '../img/green.png'
export default function Green() {    
    return (
      <div style={{backgroundColor:"#fff", boxShadow:"0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)", padding:'10px',
      borderRadius:'5px'}}>
        <img alt="Green"  src={Green1} style={{
          width:'24px'
        }}/>
        <p>All Good</p>
      </div>
    );
  }
  