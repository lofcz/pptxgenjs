<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: http://schemas.microsoft.com/office/powerpoint/2018/4/main Schema -->

## http://schemas.microsoft.com/office/powerpoint/2018/4/main Schema


1. <xsd:schema elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/office/powerpoint/2018/4/main" xmlns="http://schemas.microsoft.com/office/powerpoint/2018/4/main" xmlns:p184="http://schemas.microsoft.com/office/powerpoint/2018/4/main" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
2.   <xsd:simpleType name="ST_ClassificationOutcomeType">
3.     <xsd:restriction base="xsd:token">
4.       <xsd:enumeration value="none"/>
5.       <xsd:enumeration value="hdr"/>
6.       <xsd:enumeration value="ftr"/>
7.       <xsd:enumeration value="watermark"/>
8.     </xsd:restriction>
9.   </xsd:simpleType>
10.   <xsd:complexType name="CT_ClassificationOutcome">
11.     <xsd:attribute name="val" type="ST_ClassificationOutcomeType"/>
12.   </xsd:complexType>
13.   <xsd:element name="classification" type="CT_ClassificationOutcome"/>
14. </xsd:schema>
