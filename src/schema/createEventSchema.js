const CreateEventSchema = {
    properties: {
        body: {
            type: 'object',
            properties: {
                name: {
                    type: 'string'
                }, 
                venue: {
                    type: 'string'
                }, 
                capacity: {
                    type: 'integer'
                }, 
                status: {
                    type: 'string',
                    enum: ['OPEN', 'CLOSED']
                }, 
                features: {
                    type: 'array'
                }, 
                isDailyAvailable: {
                    type: 'bool',
                    default: false
                }, 
                available_time: {
                    type: 'array'
                }
            },
            required: ['name']
        }
    },
    required: ['body']
}