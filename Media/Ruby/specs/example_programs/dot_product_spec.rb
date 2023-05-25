# frozen_string_literal: true

require './lib/basics'
require './lib/schema'
require './lib/table'
require './lib/table_encoder'
require './lib/type_extensions'

# rubocop:disable RSpec/DescribeClass

# gradebook: a gradebook table with no missing values
RSpec.describe 'quiz score filter' do
  include Basics

  describe 'appends average quiz score to gradebook' do
    let(:raw_table_string) do
      "
      # | name    | age | quiz1 | quiz2 | midterm | quiz3 | quiz4 | final |
      # | ------- | --- | ----- | ----- | ------- | ----- | ----- | ----- |
      # | \"Bob\"   | 12  | 8     | 9     | 77      | 7     | 9     | 87    |
      # | \"Alice\" | 17  | 6     | 8     | 88      | 8     | 7     | 85    |
      # | \"Eve\"   | 13  | 7     | 9     | 84      | 8     | 8     | 77    |
      "
    end

    # > dotProduct =
    # function(t, c1, c2):
    #   ns = getColumn(t, c1)
    #   ms = getColumn(t, c2)
    #   sum(map(range(nrows(t)),
    #     function(i):
    #       ns[i] * ms[i]
    #     end))
    # end
    # > dotProduct(gradebook, "quiz1", "quiz2")
    # 183
    context 'when happy path' do
      it 'returns a table with the average quiz score' do
        # start with a gradebook table
        gradebook = TableEncoder.encode(raw_table_string)

        dot_product = lambda do |t, c1, c2|
          # since Ruby cannot do function overloading, we use get_column_by_name instead of get_column
          ns = t.get_column_by_name(c1)
          ms = t.get_column_by_name(c2)

          sum(map(range(gradebook.nrows)) do |i|
            ns[i] * ms[i]
          end)
        end

        expect(dot_product.call(gradebook, 'quiz1', 'quiz2')).to eq(183)
      end
    end
  end
end
# rubocop:enable RSpec/DescribeClass
