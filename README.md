# VideoMaker
Este projeto foi desenvolvido com base no repositório [video-maker](https://github.com/filipedeschamps/video-maker) do [Filipe Deschamps](https://github.com/filipedeschamps), um projeto open source para a produção de vídeos automatizados para o youtube.
## Pré requisitos
* [Node.js](https://nodejs.org/en/)
* [ImageMagick](https://imagemagick.org/script/download.php)
* [After Effects](https://www.adobe.com/br/products/aftereffects/free-trial-download.html)
## Instalação
Antes de tudo, será necessário associar as apiKeys referentes as dependências externas do projeto
### [Algorithmia](https://algorithmia.com/)
Criar um apiKey e substituir o campo apiKey do arquivo credentials/algorithmia.json  
[Mais informações](https://www.youtube.com/watch?v=8XgbjUP-Gxo)
### [Watson](https://cloud.ibm.com/login)
Criar um apiKey e substituir o campo apiKey do arquivo credentials/watson.json  
[Mais informações](https://www.youtube.com/watch?v=C6bf3A95Q7A)
### [Google Cloud Plataform](https://cloud.google.com/)
* Criar a API do Google Cloud Plataform, acessando o link com uma conta google logada, criar um novo projeto, acessar a interface da API desejada (Custom Search), e criar uma apiKey nas opções credencials. Substituir o campo key do arquivo credentials/googleConsole.json
* Configurar o motor de busca do google, acessando [Custom Search Enginer](https://cse.google.com/cse/create/new), após a criação copiar o ID do mecanismo de pesquisa para o campo searchEngineID do arquivo credentials/googleConsole.json  
[Mais informações](https://www.youtube.com/watch?v=LzPuCVhdUew&t=18s)
### [API Youtube](https://cloud.google.com/)
* Ativar a Api Youtube V3 da plataforma do Google Cloud, e realizar a autenticação oAuth2, sem seguida baixar o arquivo JSON gerado pela plataforma, e substituir os campos do arquivo credetials/googleCredencials.json com as informações do arquivo baixado.  
[Mais informações](https://www.youtube.com/watch?v=qYXBWBZTAbc&t=928s)
###Dependências
Por fim, instalar as dependências gerenciadas pelo npm
```
npm install
```
## Executar
```
node index.js
```
## Agradecimentos
Novamente, devo agradecer ao entusiasmo do Felipe Deschamps, por disponibilizar essa idéia para a comunidade, com todo o apóio dos vídeos no Youtube [Clique Aqui](https://www.youtube.com/channel/UCU5JicSrEM5A63jkJ2QvGYw), o canal desse cara é incrível.

