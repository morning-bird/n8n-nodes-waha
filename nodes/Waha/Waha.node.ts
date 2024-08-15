import { IExecuteFunctions } from 'n8n-core';
import {
    IBinaryData,
    IBinaryKeyData,
    INodeExecutionData,
    INodeType,
    INodeTypeDescription,
} from 'n8n-workflow';
import { OptionsWithUri } from 'request';

export class Waha implements INodeType {
    description: INodeTypeDescription = {
        // Basic node details will go here
        properties: [
            {
                displayName: 'Resource',
                name: 'resource',
                type: 'options',
                noDataExpression: true,
                options: [
                    {
                        name: 'Chatting',
                        value: 'chatting',
                    },
                    {
                        name: 'Session',
                        value: 'session',
                    },
                    {
                        name: 'Auth',
                        value: 'auth',
                    },
                ],
                default: 'chatting',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['chatting'],
                    },
                },
                options: [
                    {
                        name: 'Send Text',
                        value: 'sendText',
                        action: 'Send text',
                        description: 'Send Text Message',
                    },
                    {
                        name: 'Send Image',
                        value: 'sendImage',
                        action: 'Send image',
                        description: 'Send Image Message',
                    },
                ],
                default: 'sendText',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['session'],
                    },
                },
                options: [
                    {
                        name: 'Log Out',
                        value: 'logout',
                        action: 'Log out',
                    },
                    {
                        name: 'Me',
                        value: 'me',
                        action: 'Me',
                    },
                    {
                        name: 'Sessions',
                        value: 'sessions',
                        action: 'Sessions',
                    },
                    {
                        name: 'Start',
                        value: 'start',
                        action: 'Start',
                    },
                    {
                        name: 'Stop',
                        value: 'stop',
                        action: 'Stop',
                    },
                ],
                default: 'start',
            },
            {
                displayName: 'Chat ID',
                name: 'chatId',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['sendText', 'sendImage'],
                        resource: ['chatting'],
                    },
                },
                default: '',
                placeholder: 'xxxxxxx@c.us',
            },
            {
                displayName: 'Text',
                name: 'text',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['sendText'],
                        resource: ['chatting'],
                    },
                },
                default: '',
                placeholder: '',
                description: 'Text to send',
            },
            {
                displayName: 'Image',
                name: 'image',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['sendImage'],
                        resource: ['chatting'],
                    },
                },
                default: '',
                description: 'URL or Base64 of the image to send',
            },
            {
                displayName: 'Caption',
                name: 'caption',
                type: 'string',
                displayOptions: {
                    show: {
                        operation: ['sendImage'],
                        resource: ['chatting'],
                    },
                },
                default: '',
                description: 'Caption for the image',
            },
            {
                displayName: 'Operation',
                name: 'operation',
                type: 'options',
                noDataExpression: true,
                displayOptions: {
                    show: {
                        resource: ['auth'],
                    },
                },
                options: [
                    {
                        name: 'QR',
                        value: 'qr',
                        action: 'QR',
                    },
                ],
                default: 'qr',
            },
            {
                displayName: 'Webhook URL',
                name: 'webhookUrl',
                type: 'string',
                required: true,
                displayOptions: {
                    show: {
                        operation: ['start'],
                        resource: ['session'],
                    },
                },
                default: '',
                placeholder: 'https://n8n.gms.church/xxxxxxxxx',
            },
        ],
        version: 2,
        defaults: {
            name: 'Waha',
        },
        inputs: ['main'],
        outputs: ['main'],
        displayName: 'Waha',
        name: 'Waha',
        icon: 'file:waha.svg',
        group: ['whatsapp'],
        description: 'Connect with Whatsapp HTTP API',
        credentials: [
            {
                name: 'wahaApi',
                required: true,
            },
        ],
        requestDefaults: {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
								'X-Api-Key': '={{$credentials.apiKey}}',
            },
            baseURL: '={{$credentials.apiUrl}}/api',
        },
    };

    async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
        const credentials = await this.getCredentials('wahaApi');
				const sessionName = credentials.session as string || 'default';
				const apiUrl = credentials.url as string;
        const items = this.getInputData();
        const returnData: INodeExecutionData[] = [];
        const resource = this.getNodeParameter('resource', 0);
        const operation = this.getNodeParameter('operation', 0) as string;

        for (let i = 0; i < items.length; i++) {
            let endpoint = '';
            let method = 'GET';
            let body: any = {};

            if (resource === 'chatting') {
                const chatId = this.getNodeParameter('chatId', i) as string;

                if (operation === 'sendText') {
                    const text = this.getNodeParameter('text', i) as string;
                    endpoint = '/sendText';
                    method = 'POST';
                    body = { chatId, text, session: sessionName };
                } else if (operation === 'sendImage') {
                    const image = this.getNodeParameter('image', i) as string;
                    const caption = this.getNodeParameter('caption', i) as string;
                    endpoint = '/sendImage';
                    method = 'POST';
                    body = {
                        chatId,
                        file: {
                            url: image.startsWith('http') ? image : undefined,
                            data: !image.startsWith('http') ? image : undefined,
                        },
                        caption,
                        session: sessionName,
                    };
                }
            } else if (resource === 'session') {
                if (operation === 'start') {
                    const url = this.getNodeParameter('webhookUrl', i) as string;
                    endpoint = '/sessions/start';
                    method = 'POST';
                    body = {
                        name: sessionName,
                        config: {
                            proxy: null,
                            webhooks: [
                                {
                                    url: url,
                                    events: ['message', 'session.status'],
                                    hmac: null,
                                    retries: null,
                                    customHeaders: null,
                                },
                            ],
                        },
                    };
                } else if (operation === 'stop') {
                    endpoint = '/sessions/stop';
                    method = 'POST';
                    body = {
                        name: sessionName,
                        logout: false,
                    };
                } else if (operation === 'logout') {
                    endpoint = '/sessions/stop';
                    method = 'POST';
                    body = {
                        name: sessionName,
                        logout: true,
                    };
                } else if (operation === 'sessions') {
                    endpoint = '/sessions';
                    method = 'GET';
                    body = { all: 'true' };
                } else if (operation === 'me') {
                    endpoint = `/sessions/${sessionName}/me`;
                    method = 'GET';
                }
            } else if (resource === 'auth') {
                if (operation === 'qr') {
                    endpoint = `/${sessionName}/auth/qr`;
                    method = 'GET';
                    body = { format: 'image' };
                }
            }

            const options: OptionsWithUri = {
                method,
                body,
                qs: method === 'GET' ? body : undefined,
                uri: `${apiUrl}/api${endpoint}`,
                json: true,
								headers: {
									'X-Api-Key': credentials.apiKey as string,
								},
            };

            try {
                const responseData = await this.helpers.request(options);

                if (resource === 'auth' && operation === 'qr') {
                    const fileName = 'qrcode.png';
                    const mimeType = responseData.mimetype;
                    const binaryPropertyName = 'qrcode';
                    const data = responseData.data;
                    const binary = {
                        [binaryPropertyName]: { data, fileName, mimeType } as IBinaryData,
                    } as IBinaryKeyData;
                    returnData.push({ json: responseData, binary });
                } else {
                    returnData.push({ json: responseData });
                }
            } catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({ json: { error: error.message } });
                    continue;
                }
                throw error;
            }
        }

        return this.prepareOutputData(returnData);
    }
}
