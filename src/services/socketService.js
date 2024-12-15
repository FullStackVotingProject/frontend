import io from 'socket.io-client';
import { toast } from 'react-toastify';

class SocketService {
    constructor() {
        this.socket = null;
        this.isConnected = false;
    }

    connect() {
        if (!this.socket && !this.isConnected) {
            this.socket = io('http://localhost:5000', {
                transports: ['websocket'],
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionDelayMax: 5000,
                reconnectionAttempts: 5
            });

            this.socket.on('connect', () => {
                console.log('Connected to WebSocket server');
                this.isConnected = true;
            });

            this.socket.on('pollEnded', (data) => {
                console.log('Poll ended event received:', data);
                
                // Afficher une notification toast
                toast.info(data.message, {
                    position: "top-right",
                    autoClose: 8000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    style: {
                        background: '#EBF8FF',
                        color: '#2B6CB0',
                        borderRadius: '8px',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }
                });

                // Déclencher un événement personnalisé pour mettre à jour l'interface
                const event = new CustomEvent('pollEnded', { 
                    detail: data,
                    bubbles: true,
                    cancelable: true
                });
                window.dispatchEvent(event);
            });

            this.socket.on('disconnect', () => {
                console.log('Disconnected from WebSocket server');
                this.isConnected = false;
            });

            this.socket.on('connect_error', (error) => {
                console.error('WebSocket connection error:', error);
                this.isConnected = false;
            });
        }
        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.isConnected = false;
        }
    }

    // Méthode pour vérifier si le socket est connecté
    isSocketConnected() {
        return this.isConnected && this.socket?.connected;
    }
}

// Export une instance unique du service
const socketService = new SocketService();
export default socketService;
