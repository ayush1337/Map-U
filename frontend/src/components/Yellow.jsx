import Yellow1 from '../img/yellow.png'
export default function Yellow() {    
    return (
      <div style={{backgroundColor:"#fff", boxShadow:"0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)", padding:'10px',
      borderRadius:'5px'}}>
      <img alt="Yellow" src={Yellow1}
      style={{
        width:'24px'
      }}
      />
      <p>Moderate Severity</p>
    </div>
    );
  }
  