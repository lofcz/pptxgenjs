<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: http://schemas.microsoft.com/office/powerpoint/2015/09/main Schema -->

## http://schemas.microsoft.com/office/powerpoint/2015/09/main Schema


1. <xsd:schema elementFormDefault="qualified" targetNamespace="http://schemas.microsoft.com/office/powerpoint/2015/09/main" xmlns="http://schemas.microsoft.com/office/powerpoint/2015/09/main" xmlns:p159="http://schemas.microsoft.com/office/powerpoint/2015/09/main" xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" xmlns:xsd="http://www.w3.org/2001/XMLSchema">
2.   <xsd:import namespace="http://schemas.openxmlformats.org/presentationml/2006/main" schemaLocation="pml.xsd"/>
3.   <xsd:simpleType name="ST_TransitionMorphOption">
4.     <xsd:restriction base="xsd:token">
5.       <xsd:enumeration value="byObject"/>
6.       <xsd:enumeration value="byWord"/>
7.       <xsd:enumeration value="byChar"/>
8.     </xsd:restriction>
9.   </xsd:simpleType>
10.   <xsd:complexType name="CT_MorphTransition">
11.     <xsd:attribute name="option" type="ST_TransitionMorphOption" use="required"/>
12.   </xsd:complexType>
13.   <xsd:element name="morph" type="CT_MorphTransition"/>
14. </xsd:schema>
