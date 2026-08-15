<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Complex Types -->

### Complex Types


#### <a id="section_d6e01ce691b3406588d4257fca7eb817"></a><a id="_Toc174686073"></a>CT_Track

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2017/3/main

*Referenced by: *[CT_TrackList](#Section_f57b08e41bf8444d883ecf9d058d6ef0)

<a id="CC_baf637d2000000000000000000000000"></a>A complex type that specifies a caption file. 

*Attributes:*

<a id="CC_b8ba072e000000000000000000000000"></a>__id: __A s:ST_Guid ([[ISO/IEC29500-4:2016]](https://go.microsoft.com/fwlink/?linkid=861068) section A.8.9) attribute that specifies a uniquely generated ID to identify the track. 

<a id="CC_0304f855000000000000000000000000"></a>__label: __A xsd:string ([[XMLSCHEMA2/2]](https://go.microsoft.com/fwlink/?LinkId=90609) section 3.2.1) attribute that specifies a label for the track.

<a id="CC_60abe18b000000000000000000000000"></a>__lang: __An a:ST_TextLanguageID ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section A.5.1) attribute that specifies the language of the track.

__r:embed: __A __r:ST_RelationshipId__ ([ISO/IEC29500-4:2016] section A.8.8) attribute that specifies the relationship identifier that is used to determine the location of the media if it is embedded in the document. The __r:embed__ attribute MUST be present if the __r:link__ attribute is not present. If both the __r:embed __and __r:link __attributes are present, the __r:link __attribute takes precedence.

__r:link: __A __r:ST_RelationshipId__ ([ISO/IEC29500-4:2016] section A.8.8) attribute that specifies the relationship identifier that is used to determine the location of the media if it is linked from the document. The __r:link__ attribute MUST be present if the __r:embed __attribute is not present. If both the __r:link __and __r:embed __attributes are present, the __r:link __attribute takes precedence.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_Track">
2.   <xsd:attribute name="id" type="s:ST_Guid" use="required"/>
3.   <xsd:attribute name="label" type="xsd:string" use="required"/>
4.   <xsd:attribute name="lang" type="a:ST_TextLanguageID" use="optional"/>
5.   <xsd:attributeGroup ref="a:AG_Blob"/>
6. </xsd:complexType>

See section [5.12](#Section_f696ec1adb5c4234b5af123d2c8e6a2b) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_f57b08e41bf8444d883ecf9d058d6ef0"></a><a id="_Toc174686074"></a>CT_TrackList

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2017/3/main

*Referenced by: *[CT_TracksInfo](#Section_6ef28bd41b5e4aa1b637174ddd9ea31b)

<a id="CC_c274e08d000000000000000000000000"></a>A complex type that specifies a list of tracks.

*Child Elements:*

<a id="CC_bc3d7e4f000000000000000000000000"></a>__track: __A [CT_Track](#Section_d6e01ce691b3406588d4257fca7eb817) element that specifies a caption associated with a media object.

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_TrackList">
2.   <xsd:sequence>
3.     <xsd:element name="track" type="CT_Track" minOccurs="0" maxOccurs="unbounded"/>
4.   </xsd:sequence>
5. </xsd:complexType>

See section [5.12](#Section_f696ec1adb5c4234b5af123d2c8e6a2b) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).

#### <a id="section_6ef28bd41b5e4aa1b637174ddd9ea31b"></a><a id="_Toc174686075"></a>CT_TracksInfo

*Target namespace: *http://schemas.microsoft.com/office/powerpoint/2017/3/main

*Referenced by: *[tracksInfo](#Section_b115e940574e4149981fff44674b4d90)

<a id="CC_7f5a54f0000000000000000000000000"></a>A complex type that specifies the information for all tracks associated with a media object.

*Child Elements:*

<a id="CC_42777cf9000000000000000000000000"></a>__trackLst: __A [CT_TrackList](#Section_f57b08e41bf8444d883ecf9d058d6ef0) element that specifies a list of the tracks for a given media.

*Attributes:*

<a id="CC_834e79a1000000000000000000000000"></a>__displayLoc: __An [ST_DisplayLocation](#Section_252c463b78cf4944868eb3608ad20ec2) attribute that specifies where a track is displayed. 

The following W3C XML Schema ([[XMLSCHEMA1/2]](https://go.microsoft.com/fwlink/?LinkId=90607) section 2.1) fragment specifies the contents of this complex type.

1. <xsd:complexType name="CT_TracksInfo">
2.   <xsd:sequence>
3.     <xsd:element name="trackLst" type="CT_TrackList" minOccurs="0" maxOccurs="1"/>
4.   </xsd:sequence>
5.   <xsd:attribute name="displayLoc" type="ST_DisplayLocation" use="required"/>
6. </xsd:complexType>

See section [5.12](#Section_f696ec1adb5c4234b5af123d2c8e6a2b) for the full W3C XML Schema ([XMLSCHEMA1/2] section 2.1).
