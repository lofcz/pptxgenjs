<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Simple Types -->

### Simple Types


#### <a id="section_252c463b78cf4944868eb3608ad20ec2"></a><a id="_Toc174686077"></a>ST_DisplayLocation

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2017/3/main

*Referenced by: *[CT_TracksInfo](#Section_6ef28bd41b5e4aa1b637174ddd9ea31b)

<a id="CC_b4f2dee1000000000000000000000000"></a>A simple type that specifies where a track for a media object is displayed. 

Value

Meaning

media

<a id="CC_1a9902b1000000000000000000000000"></a>The track is displayed on the media.

slide

<a id="CC_6417b822000000000000000000000000"></a>The track is displayed on the slide. 

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this simple type.

1. <xsd:simpleType name="ST_DisplayLocation">
2.   <xsd:restriction base="xsd:string">
3.     <xsd:enumeration value="media"/>
4.     <xsd:enumeration value="slide"/>
5.   </xsd:restriction>
6. </xsd:simpleType>

See section [5.12](#Section_f696ec1adb5c4234b5af123d2c8e6a2b) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
