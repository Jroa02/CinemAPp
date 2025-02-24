const API_BASE_URL = 'http://localhost:3000';

const request = async (endpoint, { method = 'GET', body } = {}) => {
  console.log(`📡 Haciendo petición a: ${API_BASE_URL}${endpoint} con método ${method}`);

  const options = {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (!response.ok) {
      // Intenta obtener el mensaje de error del cuerpo de la respuesta
      const error = await response.json().catch(() => response.statusText);
      console.error(`❌ Error ${response.status}: ${error}`);
      throw new Error(`Error ${response.status}: ${error}`);
    }

    console.log('✅ Petición exitosa');

    // Verifica si la respuesta tiene un cuerpo JSON
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return response.json(); // Devuelve el JSON parseado
    } else {
      return response; // Devuelve la respuesta sin parsear
    }
  } catch (error) {
    console.error('⚠️ Error en la petición:', error.message);
    throw error;
  }
};

// Exportaciones de las APIs (sin cambios)
export const MovieAPI = {
  getAll: async () => await request('/movies'),
  getById: async (movie_id) => await request(`/movies/${movie_id}`),
  create: async (movie) => await request('/movies', { method: 'POST', body: movie }),
  update: async (movie) => await request(`/movies/${movie.id}`, { method: 'PUT', body: movie }),
  delete: async (id) => await request(`/movies/${id}`, { method: 'DELETE' }),
};

export const RoomAPI = {
  getAll: async () => await request('/rooms'),
  getById: async (room_id) => await request(`/rooms/${room_id}`),
  create: async (room) => await request('/rooms', { method: 'POST', body: room }),
  update: async (room) => await request(`/rooms/${room.id}`, { method: 'PUT', body: room }),
  delete: async (id) => await request(`/rooms/${id}`, { method: 'DELETE' }),
};

export const ScheduleAPI = {
  getAll: async () => await request('/schedules'),
  create: async (schedule) => await request('/schedules', { method: 'POST', body: schedule }),
  update: async (schedule) => await request(`/schedules/${schedule.id}`, { method: 'PUT', body: schedule }),
  delete: async (id) => await request(`/schedules/${id}`, { method: 'DELETE' }),
};

export const SeatAPI = {
  getAll: async () => await request('/seats'),
  getByRoom: async (room_id) => await request(`/seats?room=${room_id}`),
  getReservedBySchedule: async (schedule_id) => await request(`/seats/reserved/${schedule_id}`),
};

export const ReservationAPI = {
  create: async (reservation) => await request('/reservations', { method: 'POST', body: reservation }),
  getAll: async () => await request('/reservations'),
  getDetails: async (reservation_id) => await request(`/reservations/${reservation_id}/details`),
  delete: async (id) => await request(`/reservations/${id}`, { method: 'DELETE' }),
};

export const ReservationSeatAPI = {
  create: async (reservationSeat) => await request('/reserved-seats', { method: 'POST', body: reservationSeat }),
  delete: async (reservation_id,seat_id) => await request(`/reserved-seats/${reservation_id}/${seat_id}`, { method: 'DELETE' }),
};

export const emailAPI = {
  send: async (email) => await request('/notifications/emails', { method: 'POST', body: email })
}
