navbar.innerHTML =`

   <button class="menu" onclick="abrirNav()"><i class="fa-solid fa-bars"></i></button>
     <div class="esquerda" >
      <a class="logo" href="index.html"><img src="assets/icon/logo.png" alt=""></a>
      <div class="links">
        <a href="">Início</a>
        <a href="#sobre">Sobre</a>
        <a href="#contato">Contato</a>
      </div>
    </div>
    <div class="entradas" id="loginsCadastroNav">
      <a href="login.html" class="login">Login</a>
      <a href="cadastro.html" class="registro">Cadastre-se</a>
    </div>
  
`
if(window.scrollY ==100){
    alert(5)
}
function abrirNav(){
    if(loginsCadastroNav.style.display=="flex"){
        loginsCadastroNav.style.display="none"
        loginsCadastroNav.style.transition="2s"
    }else{
        loginsCadastroNav.style.display="flex"
    }
}
window.addEventListener('scroll', () => {
        if(window.scrollY >=100 || window.innerWidth<600){
        navbar.style.backgroundColor = "#fff"
        navbar.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.08)"
        
    }else{
        navbar.style.backgroundColor = "transparent"
        navbar.style.boxShadow = "none"
      

    }
});

// Carrega o componente flutuante do BobIA nas telas públicas com navbar
if (!document.getElementById("script-bobia-component")) {
    const scriptBobia = document.createElement("script");
    scriptBobia.id = "script-bobia-component";
    scriptBobia.src = "js/componentes/bobia.js";
    document.body.appendChild(scriptBobia);
}