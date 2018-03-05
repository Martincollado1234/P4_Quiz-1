
const model = require('./model');
const {log, biglog, errorlog, colorize} = require("./out");

exports.helpCmd = rl => {
    log("Comandos:");
    log("  h|help - Muestra esta ayuda.");
    log("  list - Listar los quizzes existentes.");
    log("  show <id> - Muestra la pregunta y la respuesta del quiz indicado.");
    log("  add - Añadir un nuevo quiz interactivamente.");
    log("  delete <id> - Borrar el quiz idicado.");
    log("  edit <id> - Editar el quiz indicado.");
    log("  test <id> - Probar el quiz indicado.");
    log("  p|play - Jugar a preguntar aleatoriamente todos los quizzes.");
    log("  credits - Créditos.");
    log("  q|quit - Salir del programa.");
    rl.prompt();
};

exports.addCmd = rl => {
    rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {
        rl.question(colorize(' Introduzca la respuesta ', 'red'), answer => {
            model.add(question, answer);
            log(` ${colorize('Se ha añadido', 'magenta')}: ${question} ${colorize('=>', 'magenta')} ${answer}`);
            rl.prompt();
        });
    }); 
};

exports.listCmd = rl => {
    model.getAll().forEach((quiz, id) => {
        log(`  [${colorize(id, 'magenta')}]: ${quiz.question}`);
    });
    rl.prompt();
};

exports.showCmd = (rl, id) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parametro id.`);
    } else {
        try {
            const quiz = model.getByIndex(id);
            log(`  [${colorize(id, 'magenta')}]: ${quiz.question} ${colorize('=>', 'magenta')} ${quiz.answer}`);
        } catch (error) {
            errorlog(error.message);
        }
    }
    rl.prompt();
};

exports.testCmd = (rl, id) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parametro id.`);
        rl.prompt();
    } else {
        try {
            const quiz = model.getByIndex(id);
            rl.question(colorize(` ${quiz.question} `, 'red'), respuesta => {
                let quest = quiz.answer.toLowerCase().trim();
                let answ = respuesta.toLowerCase().trim();
                if (answ === quest) {
                    log(`Su respuesta es:`);
                    biglog(`CORRECTO`, 'green');
                    rl.prompt();
                } else {
                    log(`Su respuesta es:`);
                    biglog(`INCORRECTO`, 'red');
                    rl.prompt();
                }
            });
        } catch (error) {
            errorlog(error.message);
            rl.prompt();
        }
    }
};

exports.playCmd = rl => {
    let score = 0;
    let toBeResolved = new Array();
    let i=0;
    for(i ; i<model.count(); i++){
       toBeResolved[i]=i;
    }
    const playOne = () => {
        if (toBeResolved.length <= 0) {
            log(`No hay mas preguntas`);
            log(`Fin del examen. Aciertos:`);
            log(`${score}`);
            rl.prompt();
        } else {
            let id = Math.floor(Math.random() * toBeResolved.length);
            let quiz = model.getByIndex(toBeResolved[id]);
            toBeResolved.splice(id,1);
            rl.question(quiz.question+"?"+" ", respuesta => {
                let quest = quiz.answer.toLowerCase().trim();
                let answ = respuesta.toLowerCase().trim();
                if(answ === quest){
                    score++;
                    log(`CORRECTO - Lleva ${score} aciertos.`);
                    playOne();
                }
                else{
                    log(`INCORRECTO`);
                    log(`Fin del examen. Aciertos:`);
                    log(`${score}`);
                    rl.prompt();
                }
            });
        }
    };
    playOne();
};

exports.deleteCmd = (rl, id) => {
    if (typeof id === "undefined") {
        errorlog(`Falta el parametro id.`);
    } else {
        try {
            model.deleteByIndex(id);
            } catch (error) {
            errorlog(error.message);
        }
    }
    rl.prompt();
};

exports.editCmd = (rl, id) => {
   if (typeof id === "undefined") {
        errorlog(`Falta el parametro id.`);
        rl.prompt();
    } else {
        try {
            const quiz = model.getByIndex(id);
            process.stdout.isTTY && setTimeout(() => {rl.write(quiz.question)}, 0);
            rl.question(colorize(' Introduzca una pregunta: ', 'red'), question => {
                process.stdout.isTTY && setTimeout(() => {rl.write(quiz.answer)}, 0);
                rl.question(colorize(' Introduzca la respuesta ', 'red'), answer => {
                    model.update(id, question, answer);
                    log(` Se ha cambiado el quiz ${colorize(id, 'magenta')} por: ${question} ${colorize('=>', 'magenta')} ${answer}`);
                    rl.prompt();
                });
            });
        } catch(error) {
           errorlog(error.message);
           rl.prompt();
        }
    }
};

exports.credits = rl => {
    log('Autor de la práctica:', 'green');
    log('JOSE', 'green');
    log('Martin Collado', 'green');
    rl.prompt();
};

exports.quitCmd = rl => {
    rl.close();
};