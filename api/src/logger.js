
const winston = require('winston')
const ecsFormat = require('@elastic/ecs-winston-format')

const logger = winston.createLogger({
  format: ecsFormat(), 
  transports: [
    new winston.transports.File({
      dirname:"./logs"
    })
  ]
})

logger.stream = {
  write: function(message, encoding){
      logger.info(message);
  }
};

module.exports = logger