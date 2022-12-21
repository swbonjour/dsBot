const { SlashCommandBuilder } = require("discord.js");

const questions = 
[
	{
		"question": "What color is the sky?",
		"answers": ["blue"]
	},
	{
		"question": "How many letters are there in the alphabet?",
		"answers": ["26", "twenty-six", "twenty six", "twentysix",]
	},
    {
        "question": "Кто быстрее напишет ABOBA",
        "answers": ["ABOBA"],
    },
    {
        "question": "Глава химтеха",
        "answers": ["Бобби"],
    },
    {
        "question": "Любит девочек помладше",
        "answers": ["Второв"],
    },
    {
        "question": "Категория для кукисов, кто идельный кандидат для кукинга?",
        "answers": ["Лена"],
    },
    {
        "question": "Три буквы дота 2",
        "answers": ["zxc"],
    },
]

let players = [];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quiz')
        .setDescription('quiz test'),
    async execute(interaction) {
        const item = questions[Math.floor(Math.random() * questions.length)];
        const filter = response => {
            return questions[questionOrder].answers.some(answer => answer.toLowerCase() == response.content.toLowerCase()) || response.content == '-stop';
        }

        // const filter = (reaction, user) => {
        //     console.log(interaction);
        //     return reaction.emoji.name == '👍' && user.id === message.author.id;
        // }

        const collector = interaction.channel.createMessageCollector({ filter });

        const questionAmount = questions.length;
        let questionOrder = 0;
        collector.on('collect', m => {
            console.log(m.content)
            if(m.content == '-stop') {
                interaction.followUp(`Quiz was stopped`);
                collector.stop();
                return;
            }
            if(players[m.author] == undefined) {
                players[m.author] = 5;
            } else {
                players[m.author] += 5;
            }
            interaction.followUp(`${m.author} won this round +5 points [Amount of points: ${players[m.author] || 5}]`);
            console.log(players);
            if(questionOrder < questionAmount - 1) {
                questionOrder++;
                interaction.followUp(`${questions[questionOrder].question}`);
                console.log(questionOrder, questionAmount)
            } else {
                const winnerIndex = Object.values(players).indexOf(Math.max.apply(Math, Object.values(players)));
                const winner = Object.keys(players)[winnerIndex];
                interaction.followUp(`End of quiz! The winner is ${winner}`);
                collector.stop();
            }
        })

        collector.on('end', m => {
            players = [];
            console.log(m.size);
        })

        interaction.reply(questions[questionOrder].question);

        // interaction.reply({ content: item.question, fetchReply: true })
	    // .then(() => {
	    // 	interaction.channel.awaitMessages({ filter, max: 4, time: 10000, errors: ['time'] })
	    // 		.then(collected => {
        //             console.log(collected.first());
	    // 			interaction.followUp(`${collected.first().author} got the correct answer!`);
	    // 		})
	    // 		.catch(collected => {
        //             console.log(collected);
	    // 			interaction.followUp('Looks like nobody got the answer this time.');
	    // 		});
	    // });
        // let i = 2;
        // const countDown = setInterval(() => {
        //     interaction.editReply({ content: `${i - 1}` });
        //     i--;
        // }, 1000);
        
        // setTimeout(() => {
        //     clearInterval(countDown);
        // }, 3000)

    //     const message = await interaction.reply({ content: item.question, fetchReply: true })
    //     message.react('👍');
    //     message.awaitReactions({ filter, max: 1, time: 5000, errors: ['time'] })
    //         .then(collected => {
    //             //console.log(collected);
    //             interaction.followUp(`${collected.first().message.author} got the correct answer`);
    //         })
    //         .catch(collected => {
    //             //console.log(collected);
    //             interaction.followUp('Looks like nobody got the answer this time.');
    //         })
    }
}