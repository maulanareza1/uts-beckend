var http = require("http")
var url = require("url")
var fs = require("fs")
var qs = require("querystring")
var port = process.env.PORT || 5000

var renderAbout = fs.readFileSync("./pages/about.html");
var renderProfil = fs.readFileSync("./pages/profil.html");
var renderCari = fs.readFileSync("./pages/cari.html");

function css(request, response) {
    if (request.url === "/style.css") {
        response.writeHead(200, { "Content-type": "text/css" });
        var fileContents = fs.readFileSync("./style.css", { encoding: "utf8" });
        response.write(fileContents);
        response.end();
    }
}

var server = http.createServer(function(request,response){
    css(request, response);
    response.writeHead(200, { "Content-Type": "text/html" });
    var q = url.parse(request.url,true)
    if (q.pathname == "/" && request.method == "GET"){
        var keyword = q.query.keyword;
        if (keyword){
            fs.readFile("./pages/cari.html", (error, data) => {
                if (error) {
                    response.writeHead(404,{"Conten-Type": "text/html"});
                    response.end("404 Not Found");
                } else {
                    response.writeHead(200, {"Content-Type": "text/html"});
                    response.write(data)
                    response.write("<h2 style='text-align: center;'>Pencarian</h2>");
                    response.write("<p style='text-align: center;'>Anda Mencari : <b>" + keyword + "</b> </p>");
                    response.write("<h3 style='text-align: center;'><b></b>Tidak ada Hasil ! Maaf Website ini masih dalam tahap pengembangan</b></h3>");
                    return response.end()
                }
            });
            }
        else{
            fs.readFile("./pages/home.html",function(error,data){
                if (error){
                    response.writeHead(404,{"Conten-Type": "text/html"});
                    response.end("404 Not Found");
                }
            response.writeHead(200,{"Content-Type":"text/html"});
            response.write(data)
            response.end();    
            });
        }
    }
    else if (request.url == '/about'){
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(renderAbout);
        response.end();
    }
    else if (request.url==="/login" && request.method === "GET"){
        fs.readFile("./pages/login.html",(error,data)=>{
            if (error){
                response.writeHead(404,{"Content-Type":"text/html"});
                return response.end("404 Server Not Found");                
            }
            else{
                response.writeHead(200, {"Content-Type":"text/html"});
                response.write(data)
                return response.end()
            }
        });
    }
    else if (request.url==="/login" && request.method === "POST"){
        var requestBody = "";
        request.on("data",function(data){
            requestBody += data;
        });
        request.on("end",function(){
            var formData = qs.parse(requestBody);
            if (formData.username === "reza" && formData.password === "1121101993"){
                response.writeHead(200,{"Content-Type":"text/html"});
                response.end(renderProfil);
                }
            else{
                response.writeHead(200,{"Content-Type":"text/html"});
                response.write("<h2>Login Gagal</h2>");
                response.write("<a href='/login'>Coba Kembali</a>");
                response.end();
            }
        });

    }
    else if (request.url==="/daftar" && request.method === "GET"){
        fs.readFile("./pages/daftar.html",(error,data) => {
            if (error){
                response.writeHead(404,{"Content-Type":"text/html"});
                return response.end("404 Server Not Found");                
            }
            else{
                response.writeHead(200, {"Content-Type":"text/html"});
                response.write(data)
                return response.end()
            }
        });
    }
    else if (request.url==="/daftar" && request.method === "POST"){ 
        
        var requestReg = "";
        request.on("data",function(data) {
            requestReg += data;
        });
        request.on("end",function(){
            var formData = qs.parse(requestReg);
            response.writeHead(200,{"Content-Type":"text/html"});
            response.write(renderCari)
            response.write('<div class="center-text">' +
            '<h5>Anda Berhasil Mendaftar Sebagai : </h5>' +
            '</div>');
            response.write('<center>'+
            '<table class="container">'+
            '<tr>'+
                '<td>'+
                    'Nama '+
                '</td>'+            
                '<td>'+
                    ': '+formData['username'] +
                '</td>'+
    
            '</tr>'+
            '<tr>'+
                '<td>'+
                    'Password '+
                '</td>'+            
                '<td>'+
                    ': '+formData['password']+
                '</td>'+
    
            '</tr>'+
            '<tr>'+
                '<td>'+
                    'Email '+
                '</td>'+            
                '<td>'+
                    ': '+formData['email']+
                '</td>'+
    
            '</tr>'+
            '<tr>'+
                '<td>'+
                    'No. Telepon '+
                '</td>'+            
                '<td>'+
                    ': '+formData['telepon']+
                '</td>'+
    
            '</tr>'+
            '</table>'+
            '</center>'
            );
            response.end()
        });
    }
});

server.listen(3000);
console.log("server Berjalan")
