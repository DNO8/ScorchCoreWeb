/**
 * Servicio para interactuar con el contrato ScorchHeartTransmuter
 * Gestiona la forja de Geodas y eclosión de CoreMiners
 */

import { ethers } from 'ethers';
import { TRANSMUTER_ABI, ERC20_ABI } from '@/lib/abis';

export enum GeodeType {
  PETIT = 0,
  ALTO = 1,
  ANIMAL = 2,
  ULTRAMECH = 3,
  TANQUE = 4,
}

export interface GeodeInfo {
  geodeType: number;
  owner: string;
  createdAt: number;
  hatchTime: number;
  isHatched: boolean;
}

export interface ForgeCosts {
  axs: string;
  slp: string;
  memento: string;
}

// Costos por tipo de geoda (deben coincidir EXACTAMENTE con el contrato)
// Valores en formato "ether" (ya con decimales)
export const GEODE_COSTS: Record<GeodeType, ForgeCosts> = {
  [GeodeType.PETIT]: {
    axs: '0.1',      // 1 * 10^17 en el contrato
    slp: '5000',     // 5000 * 10^18 en el contrato
    memento: '5',    // 5 * 10^18 en el contrato
  },
  [GeodeType.ALTO]: {
    axs: '0.5',      // 5 * 10^17 en el contrato
    slp: '10000',    // 10000 * 10^18 en el contrato
    memento: '10',   // 10 * 10^18 en el contrato
  },
  [GeodeType.ANIMAL]: {
    axs: '2.5',      // 25 * 10^17 en el contrato
    slp: '25000',    // 25000 * 10^18 en el contrato
    memento: '25',   // 25 * 10^18 en el contrato
  },
  [GeodeType.ULTRAMECH]: {
    axs: '5',
    slp: '50000',
    memento: '50',
  },
  [GeodeType.TANQUE]: {
    axs: '10',
    slp: '100000',
    memento: '100',
  },
};

export class ForgeService {
  private transmuterContract: ethers.Contract;
  private axsContract: ethers.Contract;
  private slpContract: ethers.Contract;
  private mementoContract: ethers.Contract;
  private signer: ethers.Signer;

  constructor(
    transmuterAddress: string,
    axsAddress: string,
    slpAddress: string,
    mementoAddress: string,
    signer: ethers.Signer
  ) {
    this.signer = signer;
    this.transmuterContract = new ethers.Contract(transmuterAddress, TRANSMUTER_ABI, signer);
    this.axsContract = new ethers.Contract(axsAddress, ERC20_ABI, signer);
    this.slpContract = new ethers.Contract(slpAddress, ERC20_ABI, signer);
    this.mementoContract = new ethers.Contract(mementoAddress, ERC20_ABI, signer);
  }

  /**
   * Obtiene los balances de tokens del usuario
   */
  async getTokenBalances(userAddress: string): Promise<{
    axs: string;
    slp: string;
    memento: string;
  }> {
    try {
      const [axsBalance, slpBalance, mementoBalance] = await Promise.all([
        this.axsContract.balanceOf(userAddress),
        this.slpContract.balanceOf(userAddress),
        this.mementoContract.balanceOf(userAddress),
      ]);

      return {
        axs: ethers.formatEther(axsBalance),
        slp: ethers.formatEther(slpBalance),
        memento: ethers.formatEther(mementoBalance),
      };
    } catch (error) {
      console.error('Error getting token balances:', error);
      throw new Error('Failed to get token balances');
    }
  }

  /**
   * Verifica si los tokens están aprobados
   */
  async checkApprovals(
    userAddress: string,
    geodeType: GeodeType,
    mementosExtra: number = 0
  ): Promise<{
    axsApproved: boolean;
    slpApproved: boolean;
    mementoApproved: boolean;
  }> {
    try {
      const costs = GEODE_COSTS[geodeType];
      const transmuterAddress = await this.transmuterContract.getAddress();

      const [axsAllowance, slpAllowance, mementoAllowance] = await Promise.all([
        this.axsContract.allowance(userAddress, transmuterAddress),
        this.slpContract.allowance(userAddress, transmuterAddress),
        this.mementoContract.allowance(userAddress, transmuterAddress),
      ]);

      const axsRequired = ethers.parseEther(costs.axs);
      const slpRequired = ethers.parseEther(costs.slp);
      // Incluir mementos extra en el cálculo
      const totalMementoNeeded = parseFloat(costs.memento) + mementosExtra;
      const mementoRequired = ethers.parseEther(totalMementoNeeded.toString());

      return {
        axsApproved: axsAllowance >= axsRequired,
        slpApproved: slpAllowance >= slpRequired,
        mementoApproved: mementoAllowance >= mementoRequired,
      };
    } catch (error) {
      console.error('Error checking approvals:', error);
      throw new Error('Failed to check token approvals');
    }
  }

  /**
   * Aprueba tokens para el contrato Transmuter
   */
  async approveToken(
    tokenType: 'axs' | 'slp' | 'memento',
    amount: string
  ): Promise<ethers.ContractTransactionResponse> {
    try {
      const contract =
        tokenType === 'axs'
          ? this.axsContract
          : tokenType === 'slp'
          ? this.slpContract
          : this.mementoContract;

      const transmuterAddress = await this.transmuterContract.getAddress();
      const amountWei = ethers.parseEther(amount);

      const tx = await contract.approve(transmuterAddress, amountWei);
      await tx.wait();
      return tx;
    } catch (error) {
      console.error(`Error approving ${tokenType}:`, error);
      throw new Error(`Failed to approve ${tokenType.toUpperCase()}`);
    }
  }

  /**
   * Aprueba todos los tokens necesarios para forjar una geoda
   */
  async approveAllTokens(geodeType: GeodeType, mementosExtra: number = 0): Promise<void> {
    try {
      const costs = GEODE_COSTS[geodeType];

      // Calcular memento total (base + extra)
      const totalMemento = (parseFloat(costs.memento) + mementosExtra).toString();

      // Aprobar secuencialmente para mejor visibilidad de errores
      console.log('🔐 Aprobando AXS...');
      await this.approveToken('axs', costs.axs);
      console.log('✅ AXS aprobado');

      console.log('🔐 Aprobando SLP...');
      await this.approveToken('slp', costs.slp);
      console.log('✅ SLP aprobado');

      console.log(`🔐 Aprobando Memento (${costs.memento}${mementosExtra > 0 ? ` +${mementosExtra}` : ''})...`);
      await this.approveToken('memento', totalMemento);
      console.log('✅ Memento aprobado');

      console.log('✅ Todos los tokens aprobados exitosamente');
      
      // Esperar 2 segundos para asegurar que las aprobaciones se propaguen
      console.log('⏳ Esperando 2s para propagación...');
      await new Promise(resolve => setTimeout(resolve, 2000));
      console.log('✅ Listo para forjar');
    } catch (error) {
      console.error('❌ Error approving tokens:', error);
      throw new Error('Failed to approve tokens: ' + (error as Error).message);
    }
  }

  /**
   * Forja una nueva Geoda
   */
  async forgeGeode(
    geodeType: GeodeType,
    mementosToUse: number = 0
  ): Promise<{ 
    tx: ethers.ContractTransactionResponse; 
    geodeId: bigint | null; 
    failed?: boolean;
    reason?: string;
  }> {
    try {
      console.log('🔨 Iniciando forja de geoda tipo:', geodeType);
      console.log('📿 Mementos a usar:', mementosToUse);

      // Debug: verificar configuración del contrato y signer
      console.log('\n🔍 Debug Info:');
      console.log('  Contrato address:', await this.transmuterContract.getAddress());
      console.log('  Signer address:', await this.signer.getAddress());
      console.log('  Contrato tiene runner:', this.transmuterContract.runner !== null);
      console.log('  Runner es signer:', this.transmuterContract.runner === this.signer);
      
      // CRÍTICO: Reconectar el contrato con el signer para asegurar que usa el correcto
      const contractConnected = this.transmuterContract.connect(this.signer) as ethers.Contract;
      console.log('  Contrato reconectado con signer');
      
      // Llamar directamente al método del contrato con gas limit fijo
      // Saltamos estimateGas porque el RPC del navegador tiene problemas
      console.log('\n📤 Llamando a contract.forgeGeode con gas limit fijo...');
      const tx = await contractConnected.forgeGeode(geodeType, mementosToUse, {
        gasLimit: 350000 // Gas fijo, suficiente para la transacción
      });
      
      console.log('⏳ Transacción enviada, esperando confirmación...');
      console.log('🔗 Hash:', tx.hash);

      const receipt = await tx.wait();
      if (!receipt) {
        throw new Error('No se pudo obtener el receipt de la transacción');
      }
      
      console.log('✅ Transacción confirmada');
      console.log('  Status:', receipt.status);
      console.log('  Gas usado:', receipt.gasUsed.toString());

      // Primero buscar evento ForgeFailed (forja falló por probabilidad)
      const failedEvent = receipt.logs.find((log: any) => {
        try {
          const parsed = this.transmuterContract.interface.parseLog(log);
          return parsed?.name === 'ForgeFailed';
        } catch {
          return false;
        }
      });

      if (failedEvent) {
        console.log('⚠️ Forja falló por probabilidad');
        const parsed = this.transmuterContract.interface.parseLog(failedEvent);
        return {
          tx,
          geodeId: null,
          failed: true,
          reason: 'probability'
        };
      }

      // Buscar evento GeodeForged
      const forgedEvent = receipt.logs.find((log: any) => {
        try {
          const parsed = this.transmuterContract.interface.parseLog(log);
          return parsed?.name === 'GeodeForged';
        } catch {
          return false;
        }
      });

      if (!forgedEvent) {
        throw new Error('No se encontró el evento GeodeForged en la transacción');
      }

      const parsed = this.transmuterContract.interface.parseLog(forgedEvent);
      const geodeId = parsed?.args[2];

      console.log('✅ Geoda forjada exitosamente');
      console.log('🆔 Token ID:', geodeId.toString());

      return { tx, geodeId };
    } catch (error: any) {
      console.error('❌ Error forging geode:', error);
      console.error('📋 Error completo:', JSON.stringify(error, null, 2));
      
      let errorMessage = error.message || 'Error desconocido al forjar geoda';
      
      // Detectar errores comunes
      if (error.code === 'INSUFFICIENT_FUNDS') {
        errorMessage = 'Balance insuficiente de RON para pagar el gas';
      } else if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        errorMessage = 'Transacción rechazada por el usuario';
      } else if (error.code === 'CALL_EXCEPTION') {
        errorMessage = 'La transacción fue rechazada por el contrato. Posibles causas:\n' +
          '- Balance insuficiente de tokens (AXS, SLP, Memento)\n' +
          '- Allowance insuficiente (verifica aprobaciones)\n' +
          '- Max supply alcanzado para este tipo de geoda\n' +
          '- Contrato pausado o inactivo';
      } else if (error.reason) {
        errorMessage = error.reason;
      }
      
      throw new Error('Failed to forge geode: ' + errorMessage);
    }
  }

  /**
   * Obtiene información de una geoda
   */
  async getGeodeInfo(geodeId: bigint): Promise<GeodeInfo> {
    try {
      const info = await this.transmuterContract.getGeodeInfo(geodeId);
      return {
        geodeType: info.geodeType,
        owner: info.owner,
        createdAt: Number(info.createdAt),
        hatchTime: Number(info.hatchTime),
        isHatched: info.isHatched,
      };
    } catch (error) {
      console.error('Error getting geode info:', error);
      throw new Error('Failed to get geode info');
    }
  }

  /**
   * Verifica si una geoda puede eclosionar
   */
  async canHatch(geodeId: bigint): Promise<boolean> {
    try {
      return await this.transmuterContract.canHatch(geodeId);
    } catch (error) {
      console.error('Error checking if geode can hatch:', error);
      return false;
    }
  }

  /**
   * Eclosiona una geoda para obtener un CoreMiner
   */
  async hatchGeode(geodeId: bigint): Promise<{
    tx: ethers.ContractTransactionResponse;
    minerId: bigint;
  }> {
    try {
      const tx = await this.transmuterContract.hatchGeode(geodeId);
      const receipt = await tx.wait();

      // Buscar el evento GeodeHatched
      const event = receipt.logs.find((log: any) => {
        try {
          const parsed = this.transmuterContract.interface.parseLog(log);
          return parsed?.name === 'GeodeHatched';
        } catch {
          return false;
        }
      });

      if (!event) {
        throw new Error('GeodeHatched event not found');
      }

      const parsedEvent = this.transmuterContract.interface.parseLog(event);
      const minerId = parsedEvent?.args?.minerId;

      return { tx, minerId };
    } catch (error) {
      console.error('Error hatching geode:', error);
      throw new Error('Failed to hatch geode');
    }
  }

  /**
   * Obtiene todas las geodas del usuario
   */
  async getUserGeodes(userAddress: string): Promise<bigint[]> {
    try {
      return await this.transmuterContract.getGeodesForged(userAddress);
    } catch (error) {
      console.error('Error getting user geodes:', error);
      return [];
    }
  }
}

/**
 * Factory para crear instancia del servicio
 */
export function createForgeService(
  transmuterAddress: string,
  axsAddress: string,
  slpAddress: string,
  mementoAddress: string,
  signer: ethers.Signer
): ForgeService {
  return new ForgeService(transmuterAddress, axsAddress, slpAddress, mementoAddress, signer);
}
