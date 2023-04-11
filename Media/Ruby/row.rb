class Row
  attr_accessor :schema, :value

  def initialize(schema, value)
    @schema = schema
    @value = value
  end
end
