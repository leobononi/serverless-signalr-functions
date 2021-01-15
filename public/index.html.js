const LOCAL_BASE_URL = 'http://localhost:7071';
const AZURE_BASE_URL = 'https://pollstocks.azurewebsites.net';

const getAPIBaseUrl = () => {
    const isLocal = /localhost/.test(window.location.href);
    return isLocal ? LOCAL_BASE_URL : AZURE_BASE_URL;
}

const app = new Vue({
    el: '#app',
    data() { 
        return {
            stocks: [],
            images: []
        }
    },
    methods: {
        async getStocks() {
            try {
                const apiUrl = `${getAPIBaseUrl()}/api/getStocks`;
                const response = await axios.get(apiUrl);
                console.log('Stocks fetched from ', apiUrl);
                app.stocks = response.data;
            } catch (ex) {
                console.error(ex);
            }
        }
    },
    created() {
        this.getStocks();
    }
});

const connect = () => {
    const connection = new signalR.HubConnectionBuilder().withUrl(`${getAPIBaseUrl()}/api`).build();

    connection.onclose(()  => {
        console.log('SignalR connection disconnected');
        setTimeout(() => connect(), 2000);
    });

    connection.on('updated', updatedStock => {
        const index = app.stocks.findIndex(s => s.id === updatedStock.id);
        
        if (index < 0)
            app.stocks.push(updatedStock);
        else
            app.stocks.splice(index, 1, updatedStock);
    });

    connection.on('blob', newBlob => {
        app.images.push(newBlob + "?sv=2019-12-12&ss=bf&srt=sco&sp=r&se=2021-01-12T20:41:41Z&st=2021-01-12T12:41:41Z&spr=https,http&sig=Jd3x%2FclLXCjF3iKHOoTpIebkvQpUGBDM6Mqw3DiHD1w%3D");
        console.log(app.images);
    });

    connection.start().then(() => {
        console.log("SignalR connection established");
    });
};

connect();
