<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Media Part -->

### Media Part


The following table specifies a new Media part that can be stored in a PresentationML document.

Part components

Value

Content types

Any supported audio or video type. See [[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) sections 15.2.2 and 15.2.17 for a list of possible content types.

Source relationship

http://schemas.microsoft.com/office/2007/relationships/media

An instance of a Media part specifies the binary data of a media file containing audio information, video information, or both audio and video information.

A Media part MUST be the target of an explicit relationship from a Slide part ([ISO/IEC29500-1:2016] section 13.3.8), a Slide Layout part ([ISO/IEC29500-1:2016] section 13.3.9), or a Slide Master part ([ISO/IEC29500-1:2016] section 13.3.10).

A Media part is not stored as [__XML__](#gt_982b7f8e-d516-4fd5-8d5e-1a836081ed85); instead, it involves a relationship target that is a media clip.  

A Media part can be located within or external to the package containing the relationships part; as such, the value of the __TargetMode__ attribute of the __Relationship__ element ([[ISO/IEC29500-2:2012]](https://go.microsoft.com/fwlink/?LinkID=330448) section 6.5.3.4) can be either "Internal" or "External".

A Media part MUST NOT have implicit or explicit relationships to other parts specified in [ISO/IEC29500-1:2016] or this document.
