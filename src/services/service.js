// servicios
import CaracteristicasService from './CaracacteristicasService';
import ClienteService from './ClienteService';
import ConfigService from './ConfigService';
import DecoracionService from './DecoracionService';
import DesayunoService from './DesayunoService';
import DivisasService from './DivisasService';
import EstadoRoomService from './EstadoRoomService';
import ImpuestoService from './ImpuestoService';
import RoomService from './RoomService';
import SocrataService from './SocrataService';
import TarifaService from './TarifaController';
import TipoRoomService from './TipoRoomService';
import UbicacionService from './UbicacionService';

// Agrupar todos los servicios en un objeto
const service = {
    ...CaracteristicasService,
    ...ClienteService,
    ...ConfigService,
    ...DecoracionService,
    ...DesayunoService,
    ...DivisasService,
    ...EstadoRoomService,
    ...ImpuestoService,
    ...RoomService,
    ...SocrataService,
    ...TarifaService,
    ...TipoRoomService,
    ...UbicacionService,
};

export default service;