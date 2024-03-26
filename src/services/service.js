// servicios
import CaracteristicasService from './CaracacteristicasService'
import ClienteService from './ClienteService'
import ConfigService from './ConfigService'
import CuponesService from './CuponesService'
import DecoracionService from './DecoracionService'
import DesayunoService from './DesayunoService'
import DescuentoEstadiaService from './DescuentoEstadia'
import DescuentosService from './DescuentosService'
import DivisasService from './DivisasService'
import EstadoRoomService from './EstadoRoom'
import ImpuestoService from './ImpuestoService'
import ReservaService from './ReservaService'
import ReservaMotivosService from './ReservaMotivosService'
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
    ...CuponesService,
    ...DecoracionService,
    ...DesayunoService,
    ...DescuentoEstadiaService,
    ...DescuentosService,
    ...DivisasService,
    ...EstadoRoomService,
    ...ImpuestoService,
    ...ReservaService,
    ...ReservaMotivosService,
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