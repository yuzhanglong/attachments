import { ServiceOption } from '@attachments/serendipity-public/bin/types/cliService'


module.exports = ({ operations }: ServiceOption) => {
  operations.runPluginTemplate(require('@attachments/serendipity-plugin-react'))
}

