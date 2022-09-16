const express = require('express');
const exphbs = require('express-handlebars');
const pool = require('./db/conex');


const app = express();


app.use(
    express.urlencoded({
        extended: true
    })
)

app.use(express.json());



app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');

app.use(express.static('public'))

app.get('/', (req, res) => {

    res.render('home')
})


app.post('/livros/iserindolivro', (req, res) => {

//dados que vem do corpo da requisisção
const titulo = req.body.titulo;
const qntpages = req.body.qntpages;

//query que é instrução do banco de dados
const sql =`INSERT INTO livros (titulo, qntpages) VALUES ('${titulo}', '${qntpages}')`
//execução da query
pool.query(sql, function(err){
    if(err){
        console.log(err);
        return;
        }

        res.redirect('/livros')

})
})
//resgatando os dados do banco
app.get('/livros', (req, res) => {

    const sql = "SELECT * FROM livros"
    pool.query(sql, function(err, date){
        if(err){
            console.log(err);
            return;
            }
    
        const livros = date
        console.log(livros)

        res.render('livros', {livros})
    
    })

})

//resgatando dados com filtro do banco
app.get('/livros/:id', (req, res) => {

    const id = req.params.id

    const sql = `SELECT * FROM livros WHERE id = '${id}'`

    pool.query(sql, function(err, date){
        if(err){
            console.log(err);
            return
        }

        const livro = date[0]

        res.render('livro', {livro})

    })
})

//editando dados puxando para o form
app.get('/livros/edit/:id', (req, res) => {

    const id = req.params.id

    const sql = `SELECT * FROM livros WHERE id = '${id}'`

    pool.query(sql, function(err, date){
        if(err){
            console.log(err);
            return
        }

        const livro = date[0]
        res.render('editlivro', {livro})
    })

})

//criandoo update fazendo os dados do form serem puxados para o banco
app.post('/livros/updatelivro', (req, res) => {

    
    const id = req.body.id
    const titulo = req.body.titulo
    const qntpages = req.body.qntpages;

    const sql = `UPDATE livros SET titulo = '${titulo}', qntpages = '${qntpages}' WHERE id = ${id}`;
    //comando para puxar o id e voltar para pagina detalhes
    const sql2 = `SELECT * FROM livros WHERE id = '${id}'`


    pool.query(sql)
    pool.query(sql2, function(err, date){
        if(err){
            console.log(err);
            return
        }
         
        
        const livro = date[0]
        res.render('livro', {livro})
        console.log(livro)
        //res.redirect('/livros',{livro})
    })

})

app.post('/livros/remove/:id', (req, res) => {

    const id = req.params.id

    const sql = `DELETE FROM livros WHERE id = '${id}'`

    pool.query(sql, function(err) {
        if(err){
            console.log(err);
            return
        }

        res.redirect('/livros')
    })

})


app.listen(3000, () => {
    console.log('Servidor iniciado')
})