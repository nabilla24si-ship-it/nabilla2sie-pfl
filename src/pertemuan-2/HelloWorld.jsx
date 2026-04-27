export default function HelloWorld(){
    return (
        <div>
            <h1>Hello World</h1>
            <p>Selamat Belajar ReactJs</p>
            <GreetingBinjai />
        

             <UserCard 
	            nama="Nabilla Suharman" 
	            nim="2457301105"
	            tanggal={new Date().toLocaleDateString()}
	          />
        </div>
    )
}



function GreetingBinjai () {
    return (
        <small>selamat dari binjai</small>
    )
}

function UserCard(props){
    return (
        <div>
            <hr/>
            <h3>Nama: {props.nama}</h3>
            <p>NIM: {props.nim}</p>
            <p>Tanggal: {props.tanggal}</p>
        </div>
    )
}