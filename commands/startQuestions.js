const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder } = require("discord.js");

const questions = [
    {
        question: "Сколько часов человеку нужно заряжаться?",
        answers: ['12 часов', '8 часов', 'Человку не нужно заряжаться'],
        points: [10, 5, -10],
    },
    {
        question: "Деликатес?",
        answers: ['Масло', 'Шашлык', 'Лобстеры'],
        points: [10, 5, -10],
    }
]

const questionLength = questions.length;
let questionOrder = 0;

let players = [];

const startEmbed = new EmbedBuilder()
    .setColor(0x00FF00)
    .setTitle('Начался процесс опроса, просьба соблюдать внимание!')
    .setDescription('Варианты ответа')
    .setFields(
        {name: '1 - положительный', value: 'Первый вариант ответа', inline: true},
        {name: '2 - нейтральный', value: 'Второй вариант ответа', inline: true},
        {name: '3 - отрицательный', value: 'Третий вариант ответа', inline: true},
        {name: '\u200B', value: '\u200B'},
        {name: 'После завершения опроса', value: 'Вам будем выдана роль'},
    )

const createQuestionEmbed = (color, question, answers) => {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle(question)
        .setDescription('Варианты ответа')
        .setFields(
            {name: '1 - положительный', value: answers[0], inline: true},
            {name: '2 - нейтральный', value: answers[1], inline: true},
            {name: '3 - отрицательный', value: answers[2], inline: true},
        )
}

const logNextQuestion = async (interaction, collector) => {
    if(questionOrder < questionLength - 1) {
        questionOrder++;
        const questionEmbed = createQuestionEmbed(0xFF0000, questions[questionOrder].question, questions[questionOrder].answers);
        await interaction.followUp({ content: '', embeds: [questionEmbed]} );
    } else {
        collector.stop();
    }
}

const checkExistenesOfRolesNeeded = (interaction) => {
    const roles = [];
    interaction.guild.roles.cache.find(role => { roles.push(role.name) });
    if(roles.indexOf('Human') == -1 || roles.indexOf('Robot') == -1) {
        return true;
    }
    return false;
}

const createRoles = (interaction) => {
    if(!checkExistenesOfRolesNeeded(interaction)) {
        return;
    }
    interaction.guild.roles.create({
        name: 'Human',
        color: 'Blue',
    });
    interaction.guild.roles.create({
        name: 'Robot',
        color: 'Red',
    });
}

const giveRole = (interaction) => {
    const humanRole = interaction.guild.roles.cache.find(role => role.name == 'Human');
    const robotRole = interaction.guild.roles.cache.find(role => role.name == 'Robot');
    if(interaction.member.roles.cache.some(role => role.name == 'Robot') || interaction.member.roles.cache.some(role => role.name == 'Human')) {
        console.log('already has');
        return;
    }
    if(Object.values(players)[0] > 0) {
       interaction.member.roles.add(robotRole);
       const finalEmbed = createFinalEmbed(0xFF0000, 'Robot');
       interaction.followUp({ content: '', embeds: [finalEmbed]});
    } else {
        interaction.member.roles.add(humanRole);
        const finalEmbed = createFinalEmbed(0xFF0000, 'Human');
        interaction.followUp({ content: '', embeds: [finalEmbed]});
    }
}

const createFinalEmbed = (color, role) => {
    return new EmbedBuilder()
        .setColor(color)
        .setTitle('Поздравляем вы прошли тест!')
        .setDescription('Вы стали')
        .setFields(
            {name: `${role}`, value: 'Поздравляем еще раз!', inline: true},
        )
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('start_questions')
        .setDescription('Starts the questions section'),
    async execute(interaction) {
        createRoles(interaction);

        await interaction.reply({ content: '', embeds: [startEmbed] });
        const firstQuestion = createQuestionEmbed(0xFF0000, questions[questionOrder].question, questions[questionOrder].answers);
        await interaction.followUp({ content: '', embeds: [firstQuestion] });

        const filter = (response) => { return !response.author.bot && response.author.id == interaction.user.id }
        const collector = interaction.channel.createMessageCollector({ filter });

        collector.on('collect', async (m) => {
            if(m.content == '-stop') {
                collector.stop();
                return;
            }

            if(m.content.match(/[^1-3]/gi)) {
                return;
            }

            if(players[m.author] == undefined) {
                players[m.author] = 0;
            }
            
            interaction.member.roles.cache.find(role => console.log(role.name))

            players[m.author] += questions[questionOrder].points[Number(m.content) - 1];

            logNextQuestion(interaction, collector);
        })

        collector.on('end', (m) => {
            console.log('stopped');
            giveRole(interaction);
            questionOrder = 0;
            players = [];
        })
    }
}