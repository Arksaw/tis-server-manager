var pm2 = require('pm2');

var serverStore = {
  interval: null,
  list: [],

  default_servers: 5,
  max_server: 10,

  init() {
    return new Promise((resolve, reject) => {
      pm2.connect((err) => {
        if(err) reject(err);

        this.update().then((list) => {
          console.log(list);
          resolve();
        });
      });
    });
  },

  cleanUp() {
    pm2.disconnect();
  },

  poll(cb) {
    if(this.interval) return;

    this.timeout = setTimeout(() => {
      this.update().then((server_list) => {
        this.list = server_list;
        console.log(this.list.length);
        this.poll();

        // query server for status
      });
    }, 1000);
  },

  update() {
    return new Promise((resolve, reject) => {
      pm2.list((err, list) => {
        if (err) {
          reject(err);
        } else {
          var data = list.filter((element) => {
            return (element.name.indexOf('tis-server') !== -1 && element.pm2_env.status === 'online');
          }).map((element) => {
            return {
              name: element.name,
              id: element.pm_id,
              pid: element.pid,
              port: element.pm2_env.NODE_PORT || 8080
            };
          })

          this.list = data;
          resolve(data);
        }
      });
    });
  }
};

module.exports = serverStore;
