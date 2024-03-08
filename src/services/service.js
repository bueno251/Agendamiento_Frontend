// servicios
import CaracteristicasService from './CaracacteristicasService'
import ClienteService from './ClienteService'
import ConfigService from './ConfigService'
import DecoracionService from './DecoracionService'
import DesayunoService from './DesayunoService'
import DivisasService from './DivisasService'
import EstadoRoomService from './EstadoRoom'
import ImpuestoService from './ImpuestoService'
import ReservaService from './ReservaService'
import RoomService from './RoomService'
import SocrataService from './SocrataService'
import TarifaService from './Tarifa'
import TarifaGeneralService from './TarifasGenerales'
import TarifaEspecialesService from './TerifasEspeciales'
import TipoCancelacionService from './TipoCancelacion'
import TipoRoomService from './TipoRoom'
import UbicacionService from './UbicacionService'

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
    ...ReservaService,
    ...RoomService,
    ...SocrataService,
    ...TarifaService,
    ...TarifaGeneralService,
    ...TarifaEspecialesService,
    ...TipoCancelacionService,
    ...TipoRoomService,
    ...UbicacionService,
}

export default service