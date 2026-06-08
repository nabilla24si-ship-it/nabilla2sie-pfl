import axios from 'axios';

const API_URL = "https://aylwptnzugooqwikgswt.supabase.co/rest/v1/note";
const API_KEY = "sb_publishable_WSt1dCh8FvQ97Wia-vp8Cg_NCSIf7u_";

const headers = {
    apikey: API_KEY,
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
};

export const notesAPI = {
    async fetchNotes() {
        const response = await axios.get(API_URL, { headers });
        return response.data;
    },

    async createNote(data) {
        const payload = {
            title: data.title,
            content: data.content
        };
        const response = await axios.post(API_URL, payload, { headers });
        return response.data;
    },

    async deleteNote(id) {
        await axios.delete(`${API_URL}?id=eq.${id}`, { headers });
    }
};