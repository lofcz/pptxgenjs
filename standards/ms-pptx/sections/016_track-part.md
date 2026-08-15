<!-- sourced from [MS-PPTX] v25.0 / 2024-08-20 -->
<!-- heading: Track Part -->

### Track Part


The following table specifies a new Track part that can be stored in a PresentationML document.

Part Components

Value

Content type

text/vtt

Source relationship

http://schemas.microsoft.com/office/2017/04/relationships/track

An instance of a Track part specifies the text data of a [__Web Video Text Tracks Format (WebVTT)__](#gt_e4b6ceec-9256-4fdd-96ff-be6dc8643574) file.

A Track part MUST be the target of an explicit relationship from a Slide part ([[ISO/IEC29500-1:2016]](https://go.microsoft.com/fwlink/?linkid=861065) section 13.3.8), a Slide Layout part ([ISO/IEC29500-1:2016] section 13.3.9), or a Slide Master part ([ISO/IEC29500-1:2016] section 13.3.10).

A Tracks part can be located within or external to the package containing the relationships part; as such, the value of the __TargetMode__ attribute of the __Relationship__ element ([[ISO/IEC29500-2:2012]](https://go.microsoft.com/fwlink/?LinkID=330448) section 6.5.3.4) can be either "Internal" or "External".

A Tracks part MUST NOT have implicit or explicit relationships to other parts specified in [ISO/IEC29500-1:2016] or this document.
