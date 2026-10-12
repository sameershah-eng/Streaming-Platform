export interface MediaDeviceChoice {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'videoinput';
}

export class WebRTCManager {
  private localStream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private audioSource: MediaStreamAudioSourceNode | null = null;
  private animationFrameId: number | null = null;

  public async getAvailableDevices(): Promise<{ audioInputs: MediaDeviceChoice[]; videoInputs: MediaDeviceChoice[] }> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
        return { audioInputs: [], videoInputs: [] };
      }
      const devices = await navigator.mediaDevices.enumerateDevices();
      const audioInputs: MediaDeviceChoice[] = devices
        .filter((d) => d.kind === 'audioinput')
        .map((d, index) => ({
          deviceId: d.deviceId || `audio-${index}`,
          label: d.label || `Microphone ${index + 1}`,
          kind: 'audioinput',
        }));
      const videoInputs: MediaDeviceChoice[] = devices
        .filter((d) => d.kind === 'videoinput')
        .map((d, index) => ({
          deviceId: d.deviceId || `video-${index}`,
          label: d.label || `Camera ${index + 1}`,
          kind: 'videoinput',
        }));
      return { audioInputs, videoInputs };
    } catch {
      return { audioInputs: [], videoInputs: [] };
    }
  }

  public async startLocalMedia(
    audioDeviceId?: string,
    videoDeviceId?: string
  ): Promise<{ stream: MediaStream | null; error?: string }> {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        return { stream: null, error: 'Media devices API not supported in this browser environment.' };
      }

      const constraints: MediaStreamConstraints = {
        audio: audioDeviceId ? { deviceId: { exact: audioDeviceId } } : true,
        video: videoDeviceId ? { deviceId: { exact: videoDeviceId }, width: { ideal: 1280 }, height: { ideal: 720 } } : { width: { ideal: 1280 }, height: { ideal: 720 } },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      this.localStream = stream;
      this.setupAudioAnalysis(stream);
      return { stream };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Permission denied or device unavailable';
      return { stream: null, error: errorMsg };
    }
  }

  private setupAudioAnalysis(stream: MediaStream) {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      this.audioContext = new AudioCtx();
      this.analyser = this.audioContext.createAnalyser();
      this.analyser.fftSize = 64;
      this.audioSource = this.audioContext.createMediaStreamSource(stream);
      this.audioSource.connect(this.analyser);
    } catch {
      // Ignore audio context errors in restricted sandboxes
    }
  }

  public getAudioLevel(): number {
    if (!this.analyser) return 0;
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const avg = sum / dataArray.length;
    return Math.min(100, Math.round((avg / 255) * 100));
  }

  public toggleAudio(enabled: boolean): boolean {
    if (!this.localStream) return false;
    this.localStream.getAudioTracks().forEach((track) => {
      track.enabled = enabled;
    });
    return enabled;
  }

  public toggleVideo(enabled: boolean): boolean {
    if (!this.localStream) return false;
    this.localStream.getVideoTracks().forEach((track) => {
      track.enabled = enabled;
    });
    return enabled;
  }

  public stopLocalMedia() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this.localStream) {
      this.localStream.getTracks().forEach((track) => track.stop());
      this.localStream = null;
    }
    if (this.audioSource) {
      this.audioSource.disconnect();
      this.audioSource = null;
    }
    if (this.audioContext && this.audioContext.state !== 'closed') {
      this.audioContext.close().catch(() => {});
      this.audioContext = null;
    }
  }
}

export const webrtcManager = new WebRTCManager();
