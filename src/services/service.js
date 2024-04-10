// servicios
import CaracteristicasService from './Room/CaracacteristicasService'
import ClienteService from './ClienteService'
import ConfigService from './ConfigService'
import CuponesService from './Descuentos/CuponesService'
import DecoracionService from './Room/DecoracionService'
import DesayunoService from './Room/DesayunoService'
import DescuentoEstadiaService from './Descuentos/DescuentoEstadia'
import DescuentosService from './Descuentos/DescuentosService'
import DivisasService from './DivisasService'
import EstadoRoomService from './Room/EstadoRoom'
import ImpuestoService from './ImpuestoService'
import ReprogramarService from './reprogramarReservas/ReprogramarService'
import ReprogramarMotivosService from './reprogramarReservas/ReprogramarMotivosService'
import ReservaService from './ReservaService'
import ReservaMotivosService from './ReservaMotivosService'
import RoomService from './Room/RoomService'
import SocrataService from './SocrataService'
import TarifaService from './tarifas/Tarifa'
import TarifasOtasService from './tarifas/TarifasOtas'
import TarifaGeneralService from './tarifas/TarifasGenerales'
import TarifaEspecialesService from './tarifas/TerifasEspeciales'
import TipoCancelacionService from './TipoCancelacion'
import TipoRoomService from './Room/TipoRoom'
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
    ...ReprogramarService,
    ...ReprogramarMotivosService,
    ...ReservaService,
    ...ReservaMotivosService,
    ...RoomService,
    ...SocrataService,
    ...TarifaService,
    ...TarifasOtasService,
    ...TarifaGeneralService,
    ...TarifaEspecialesService,
    ...TipoCancelacionService,
    ...TipoRoomService,
    ...UbicacionService,
}

export default service