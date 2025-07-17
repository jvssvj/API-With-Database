class NotFoundError extends Error {
    constructor(message) {
        super(message)
        this.name = "NotFoundError"
    }
}

// Explicação Detalhada
// class NotFoundError extends Error Isso define uma nova classe chamada NotFoundError que herda da classe Error. Ou seja, ela se comporta como um erro padrão, mas com características personalizadas.

// constructor(message) O construtor é chamado quando você cria uma nova instância da classe. Ele recebe um argumento message, que é a descrição do erro.

// super(message) Aqui, o super chama o construtor da classe Error (a classe pai). Isso é necessário para que o objeto de erro seja corretamente inicializado com a mensagem fornecida.

// this.name = "NotFoundError" Por padrão, o nome de um erro é "Error". Aqui, estamos sobrescrevendo isso para "NotFoundError", o que facilita a identificação do tipo de erro quando ele for tratado ou exibido.

module.exports = NotFoundError