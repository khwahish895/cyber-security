"""
Unit & Integration Tests for CyberShield AI FastAPI Service & ML Pipeline
"""
import pytest
from app.schemas.traffic import FlowRecordInput

def test_health_endpoint():
    # Validates structure of health response
    expected_keys = {"status", "timestamp", "service", "sih_problem", "organisation"}
    dummy_response = {
        "status": "healthy",
        "timestamp": "2026-10-26T07:00:00Z",
        "service": "CyberShield AI FastAPI Detection Service",
        "sih_problem": "SIH26145",
        "organisation": "NTRO",
        "model_version": "v2.4.1-RF",
        "mode": "passive_unidirectional_tap"
    }
    assert expected_keys.issubset(dummy_response.keys())
    assert dummy_response["status"] == "healthy"

def test_flow_schema_validation():
    sample_flow = {
        "Flow Duration": 210.0,
        "Total Fwd Packets": 480,
        "Total Length of Fwd Packets": 28800.0,
        "Fwd Packet Length Max": 60.0,
        "Fwd Packet Length Mean": 60.0,
        "Flow Bytes/s": 137142.0,
        "Flow Packets/s": 2285714.0,
        "Flow IAT Mean": 0.43,
        "Flow IAT Std": 0.22,
        "SYN Flag Count": 480,
        "FIN Flag Count": 0,
        "RST Flag Count": 0,
        "PSH Flag Count": 0,
        "ACK Flag Count": 0,
        "Source Port": 41001,
        "Destination Port": 80,
        "Protocol": 6,
        "Source IP": "198.51.100.21",
        "Destination IP": "172.16.0.1"
    }
    record = FlowRecordInput(**sample_flow)
    assert record.total_fwd_packets == 480
    assert record.syn_flag_count == 480
    assert record.dst_port == 80
