import Red1 from '../img/red.png'
export default function Red() {    
    return (
      <div style={{backgroundColor:"#fff", boxShadow:"0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)", padding:'10px',
      borderRadius:'5px'}}>
      <img alt="Red" src={Red1}
      style={{
        width:'24px'
      }}
      />

      <p>Caution Might be severe danger ahead.</p>
      
    </div>
    );
  }
  