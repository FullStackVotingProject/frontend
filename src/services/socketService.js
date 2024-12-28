import io from 'socket.io-client';
import { toast } from 'react-toastify';

class SocketService {
    constructor() {
        this.socket = null;
    }

    connect() {
        if (!this.socket) {
            this.socket = io('http://localhost:5000', {
                transports: ['websocket']
            });

            this.socket.on('connect', () => {
                console.log('Connected to WebSocket server');
            });

            this.socket.on('pollEnded', (data) => {
                // Afficher une notification toast
                toast.info(data.message, {
                    position: "top-right",
                    hideProgressBar: false,
                    autoClose: 5000,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true
                });

                // Déclencher un événement personnalisé pour mettre à jour l'interface
                const event = new CustomEvent('pollEnded', { detail: data });
                window.dispatchEvent(event);
            });

            this.socket.on('error', (error) => {
                console.error('WebSocket error:', error);
            });
        }
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }
}

const socketService = new SocketService();
export default socketService;