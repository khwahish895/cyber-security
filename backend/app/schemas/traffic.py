from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

class FlowRecordInput(BaseModel):
    flow_duration_ms: float = Field(..., alias="Flow Duration", description="Duration of the flow in ms")
    total_fwd_packets: int = Field(..., alias="Total Fwd Packets", description="Total forward packets in unidirectional capture")
    total_fwd_bytes: float = Field(..., alias="Total Length of Fwd Packets")
    fwd_packet_length_max: float = Field(..., alias="Fwd Packet Length Max")
    fwd_packet_length_mean: float = Field(..., alias="Fwd Packet Length Mean")
    flow_bytes_per_sec: float = Field(..., alias="Flow Bytes/s")
    flow_packets_per_sec: float = Field(..., alias="Flow Packets/s")
    flow_iat_mean: float = Field(..., alias="Flow IAT Mean")
    flow_iat_std: float = Field(..., alias="Flow IAT Std")
    syn_flag_count: int = Field(0, alias="SYN Flag Count")
    fin_flag_count: int = Field(0, alias="FIN Flag Count")
    rst_flag_count: int = Field(0, alias="RST Flag Count")
    psh_flag_count: int = Field(0, alias="PSH Flag Count")
    ack_flag_count: int = Field(0, alias="ACK Flag Count")
    src_port: int = Field(..., alias="Source Port")
    dst_port: int = Field(..., alias="Destination Port")
    protocol: int = Field(6, alias="Protocol", description="6 for TCP, 17 for UDP, 1 for ICMP")
    src_ip: Optional[str] = Field("192.168.1.100", alias="Source IP")
    dst_ip: Optional[str] = Field("10.0.0.1", alias="Destination IP")

    class Config:
        populate_by_name = True

class FeatureContributionSchema(BaseModel):
    name: str
    value: str
    contribution: float
    direction: Literal["malicious", "benign"]
    threshold_explanation: str

class FlowClassificationResponse(BaseModel):
    flow_id: str
    timestamp: datetime
    predicted_class: str
    confidence: float
    risk_score: int
    severity: Literal["normal", "low", "medium", "high", "critical"]
    explanation: str
    is_unidirectional: bool = True
    top_features: List[FeatureContributionSchema]

class AnalysisJobSummary(BaseModel):
    job_id: str
    dataset_name: str
    status: str
    total_records: int
    threats_detected: int
    avg_risk_score: int
    completion_time: datetime
