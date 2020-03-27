const app = new Vue({
    el: '#app',
    data() {
        return {
            stocks: []
        }
    },
    methods: {
        async getStocks() {
            try {
                // const apiUrl = `https://stockssignalr-apim.azure-api.net/getStocks`;
                const response = await axios.get('/stockssignalr/getstocks', {headers: {'Access-Control-Allow-Origin': '*'}});
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
    const connection = new signalR.HubConnectionBuilder()
        .withUrl(`/stockssignalr`)
        .build();

    connection.onclose(() => {
        console.log('SignalR connection disconnected');
        setTimeout(() => connect(), 2000);
    });

    connection.on('updated', updatedStock => {
        console.log(updatedStock);
        const index = app.stocks.findIndex(s => s.id === updatedStock.id);
        if (index !== 0)
            app.stocks.push(updatedStock);
        else
            app.stocks.splice(index, 1, updatedStock);
    });

    connection.start().then(() => {
        console.log("SignalR connection established");
    });
};

connect();