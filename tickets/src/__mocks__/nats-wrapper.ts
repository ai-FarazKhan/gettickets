// we are essentially trying to fake out or duplicate the functionality of the real nats-wrapper file.
export const natsWrapper = {
    client: {
        publish: jest.fn().mockImplementation((subject: string, data: string, callback: () => void) => {
            callback();
        })
    }
};
